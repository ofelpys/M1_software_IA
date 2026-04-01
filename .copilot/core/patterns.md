# PATTERNS.MD — Padrões de Código e Arquitetura

> **Propósito**: Repository de padrões aprovados e referências de implementação  
> **Escopo**: Rede Força Total Academias  
> **Aplicável a**: Java Spring Boot, React, PostgreSQL

---

## 1. Padrão Entity + DTO (Backend Java)

### 1.1 Entity (Modelo de Persistência)

```java
package com.forcatotal.academy.entity;

import javax.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "aluno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aluno {
    
    // PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Unique constraint (RF-CAD-03)
    @Column(name = "cpf", unique = true, nullable = false, length = 14)
    private String cpf;
    
    // Required fields
    @Column(name = "nome", nullable = false, length = 255)
    private String nome;
    
    @Column(name = "email", length = 255)
    private String email;
    
    @Column(name = "telefone", length = 20)
    private String telefone;
    
    @Column(name = "data_nasc")
    private LocalDate dataNascimento;
    
    // Audit fields
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;
    
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;
    
    // Lifecycle
    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }
}
```

### 1.2 DTO (Transfer Object)

```java
package com.forcatotal.academy.dto;

import lombok.*;
import javax.validation.constraints.*;
import java.time.LocalDate;

// Request DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlunoCadastroDTO {
    
    @NotNull(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", 
             message = "CPF deve estar no formato XXX.XXX.XXX-XX")
    private String cpf;
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 255, message = "Nome deve ter entre 3 e 255 caracteres")
    private String nome;
    
    @Email(message = "Email inválido")
    private String email;
    
    @Pattern(regexp = "\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}",
             message = "Telefone deve estar no formato (XX) XXXXX-XXXX")
    private String telefone;
    
    private LocalDate dataNascimento;
}

// Response DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlunoDTO {
    
    private Long id;
    private String cpf;
    private String nome;
    private String email;
    private String telefone;
    private LocalDate dataNascimento;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}

// Mapper Helper
@Component
public class AlunoMapper {
    
    public Aluno toEntity(AlunoCadastroDTO dto) {
        return Aluno.builder()
            .cpf(dto.getCpf())
            .nome(dto.getNome())
            .email(dto.getEmail())
            .telefone(dto.getTelefone())
            .dataNascimento(dto.getDataNascimento())
            .build();
    }
    
    public AlunoDTO toDTO(Aluno entity) {
        return new AlunoDTO(
            entity.getId(),
            entity.getCpf(),
            entity.getNome(),
            entity.getEmail(),
            entity.getTelefone(),
            entity.getDataNascimento(),
            entity.getCriadoEm(),
            entity.getAtualizadoEm()
        );
    }
}
```

---

## 2. Padrão Repository (Spring Data JPA)

### 2.1 Repository Interface

```java
package com.forcatotal.academy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.forcatotal.academy.entity.Aluno;
import java.util.Optional;
import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    
    // RF-CAD-03: Verificar CPF dublado
    Optional<Aluno> findByCpf(String cpf);
    
    // Consulta customizada com Query
    @Query("SELECT a FROM Aluno a WHERE a.cpf = :cpf AND a.id != :id")
    Optional<Aluno> findByCpfExcludingId(@Param("cpf") String cpf, 
                                         @Param("id") Long id);
    
    // Pagination
    @Query(value = "SELECT * FROM aluno ORDER BY nome ASC",
           countQuery = "SELECT COUNT(*) FROM aluno",
           nativeQuery = true)
    Page<Aluno> findAllPageable(Pageable pageable);
    
    // Finder methods
    List<Aluno> findByNomeContainingIgnoreCase(String nome);
}
```

---

## 3. Padrão Service (Lógica de Negócio)

### 3.1 Service com Validações

```java
package com.forcatotal.academy.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.forcatotal.academy.entity.Aluno;
import com.forcatotal.academy.repository.AlunoRepository;
import com.forcatotal.academy.dto.AlunoCadastroDTO;
import com.forcatotal.academy.exception.CadastroException;
import com.forcatotal.academy.exception.AlunoNaoEncontradoException;

@Service
@Transactional
public class AlunoService {
    
    private static final Logger logger = LoggerFactory.getLogger(AlunoService.class);
    
    @Autowired
    private AlunoRepository alunoRepository;
    
    @Autowired
    private AlunoMapper alunoMapper;
    
    @Autowired
    private AuditoriaService auditoriaService;
    
    /**
     * RF-CAD-01: Cadastrar novo aluno
     * Valida CPF e registra auditoria
     * 
     * @param dto DTO com dados do aluno
     * @param usuarioId ID do usuário que está cadastrando (auditoria)
     * @return Aluno persistido
     * @throws CadastroException Se CPF já existir
     */
    public Aluno cadastrarAluno(AlunoCadastroDTO dto, Long usuarioId) {
        
        logger.info("Iniciando cadastro de aluno com CPF: {}", dto.getCpf());
        
        // Validação 1: Verificar duplicata (RF-CAD-03)
        if (alunoRepository.findByCpf(dto.getCpf()).isPresent()) {
            logger.warn("Tentativa de cadastro com CPF duplicado: {}", dto.getCpf());
            throw new CadastroException("CPF " + dto.getCpf() + " já está cadastrado no sistema");
        }
        
        // Validação 2: Validar formato de CPF (via Bean Validation, mas double-check aqui)
        if (!validarCPF(dto.getCpf())) {
            logger.warn("CPF inválido: {}", dto.getCpf());
            throw new CadastroException("CPF inválido: " + dto.getCpf());
        }
        
        // Converter DTO → Entity
        Aluno aluno = alunoMapper.toEntity(dto);
        
        // Persistir
        aluno = alunoRepository.save(aluno);
        logger.info("Aluno cadastrado com sucesso. ID: {}, CPF: {}", aluno.getId(), aluno.getCpf());
        
        // Auditoria (Log estruturado)
        auditoriaService.registrar(
            usuarioId,
            "CREATE",
            "ALUNO",
            aluno.getId(),
            "Aluno " + aluno.getNome() + " cadastrado",
            "SUCCESS"
        );
        
        return aluno;
    }
    
    /**
     * Obter aluno por ID
     * Lança exceção se não encontrado
     */
    public Aluno obterAluno(Long id) {
        return alunoRepository.findById(id)
            .orElseThrow(() -> {
                logger.warn("Aluno não encontrado: ID={}", id);
                return new AlunoNaoEncontradoException("Aluno com ID " + id + " não encontrado");
            });
    }
    
    /**
     * Validar CPF (algoritmo simples, na produção usar biblioteca)
     */
    private boolean validarCPF(String cpf) {
        // Remove formatação
        String cpfLimpo = cpf.replaceAll("\\D", "");
        return cpfLimpo.length() == 11 && !cpfLimpo.matches("(\\d)\\1{10}");
    }
}
```

---

## 4. Padrão Controller (REST API)

### 4.1 Controller com Validações

```java
package com.forcatotal.academy.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import javax.validation.Valid;
import java.net.URI;

import com.forcatotal.academy.entity.Aluno;
import com.forcatotal.academy.service.AlunoService;
import com.forcatotal.academy.dto.AlunoCadastroDTO;
import com.forcatotal.academy.dto.AlunoDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/alunos")
@CrossOrigin(origins = "*")
public class AlunoController {
    
    private static final Logger logger = LoggerFactory.getLogger(AlunoController.class);
    
    @Autowired
    private AlunoService alunoService;
    
    @Autowired
    private AlunoMapper alunoMapper;
    
    /**
     * POST /api/v1/alunos
     * RF-CAD-01: Criar novo aluno
     * 
     * @param dto DTO com validações
     * @param authentication Usuário autenticado (JWT)
     * @return 201 Created com AlunoDTO
     */
    @PostMapping
    public ResponseEntity<AlunoDTO> criarAluno(
            @Valid @RequestBody AlunoCadastroDTO dto,
            Authentication authentication) {
        
        logger.info("[POST /alunos] Usuário: {} | CPF: {}", 
                    authentication.getName(), dto.getCpf());
        
        // Service cuida de validações de negócio
        Long usuarioId = extrairUsuarioId(authentication);
        Aluno aluno = alunoService.cadastrarAluno(dto, usuarioId);
        
        AlunoDTO alunoDTO = alunoMapper.toDTO(aluno);
        
        return ResponseEntity
            .created(URI.create("/api/v1/alunos/" + aluno.getId()))
            .body(alunoDTO);
    }
    
    /**
     * GET /api/v1/alunos/{id}
     * RF-CAD-01: Obter aluno por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AlunoDTO> obterAluno(@PathVariable Long id) {
        logger.info("[GET /alunos/{}]", id);
        
        Aluno aluno = alunoService.obterAluno(id);
        AlunoDTO alunoDTO = alunoMapper.toDTO(aluno);
        
        return ResponseEntity.ok(alunoDTO);
    }
    
    /**
     * GET /api/v1/alunos (com paginação)
     * RF-CAD-01: Listar alunos
     */
    @GetMapping
    public ResponseEntity<Page<AlunoDTO>> listarAlunos(Pageable pageable) {
        logger.info("[GET /alunos] Paginação: page={}, size={}", 
                    pageable.getPageNumber(), pageable.getPageSize());
        
        Page<Aluno> alunos = alunoService.listarAlunos(pageable);
        Page<AlunoDTO> dtos = alunos.map(alunoMapper::toDTO);
        
        return ResponseEntity.ok(dtos);
    }
    
    // Helper
    private Long extrairUsuarioId(Authentication auth) {
        // Em produção: buscar do context JWT
        return 1L;
    }
}
```

---

## 5. Padrão Exception Handling

### 5.1 Custom Exceptions

```java
package com.forcatotal.academy.exception;

// Exception base
public class AcademiaException extends RuntimeException {
    public AcademiaException(String message) {
        super(message);
    }
    
    public AcademiaException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Específicas
public class CadastroException extends AcademiaException {
    public CadastroException(String message) {
        super(message);
    }
}

public class AlunoNaoEncontradoException extends AcademiaException {
    public AlunoNaoEncontradoException(String message) {
        super(message);
    }
}

public class AcessoNegadoException extends AcademiaException {
    public AcessoNegadoException(String message) {
        super(message);
    }
}
```

### 5.2 Global Exception Handler

```java
package com.forcatotal.academy.exception;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(CadastroException.class)
    public ResponseEntity<ErrorResponse> handleCadastroException(CadastroException ex) {
        logger.warn("CadastroException: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
            .code("CADASTRO_ERROR")
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(AlunoNaoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleAlunoNaoEncontrado(AlunoNaoEncontradoException ex) {
        logger.warn("AlunoNaoEncontradoException: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
            .code("ALUNO_NOT_FOUND")
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ErrorResponse response = ErrorResponse.builder()
            .code("VALIDATION_ERROR")
            .message("Erro na validação de dados")
            .details(errors)
            .timestamp(LocalDateTime.now())
            .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}

@Getter
@Setter
@Builder
class ErrorResponse {
    private String code;
    private String message;
    private Object details;
    private LocalDateTime timestamp;
}
```

---

## 6. Padrão React Components

### 6.1 Form Component com React Hook Form

```jsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import AlunoService from '../services/AlunoService';

function CadastroAlunoForm({ onSuccess }) {
  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    defaultValues: {
      cpf: '',
      nome: '',
      email: '',
      telefone: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const aluno = await AlunoService.criarAluno(data);
      alert(`Aluno ${aluno.nome} cadastrado com sucesso!`);
      onSuccess?.(aluno);
    } catch (error) {
      // Backend retorna erro estruturado
      if (error.response?.data?.code === 'CADASTRO_ERROR') {
        setError('cpf', {
          type: 'manual',
          message: error.response.data.message
        });
      } else {
        alert('Erro ao cadastrar: ' + error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-group">
        <label>CPF</label>
        <Controller
          name="cpf"
          control={control}
          rules={{
            required: 'CPF é obrigatório',
            pattern: {
              value: /\d{3}\.\d{3}\.\d{3}-\d{2}/,
              message: 'CPF deve estar no formato XXX.XXX.XXX-XX'
            }
          }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="000.000.000-00"
              className={errors.cpf ? 'input-error' : ''}
            />
          )}
        />
        {errors.cpf && <span className="error">{errors.cpf.message}</span>}
      </div>

      <div className="form-group">
        <label>Nome</label>
        <Controller
          name="nome"
          control={control}
          rules={{
            required: 'Nome é obrigatório',
            minLength: { value: 3, message: 'Mínimo 3 caracteres' }
          }}
          render={({ field }) => <input {...field} type="text" />}
        />
        {errors.nome && <span className="error">{errors.nome.message}</span>}
      </div>

      <button type="submit" className="btn-primary">
        Cadastrar
      </button>
    </form>
  );
}

export default CadastroAlunoForm;
```

### 6.2 Service Com Interceptor

```jsx
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class AlunoService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL
    });

    // Interceptor para adicionar JWT
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratar erros 401
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('jwtToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async criarAluno(data) {
    const response = await this.api.post('/alunos', data);
    return response.data;
  }

  async obterAluno(id) {
    const response = await this.api.get(`/alunos/${id}`);
    return response.data;
  }

  async listarAlunos(page = 0, size = 10) {
    const response = await this.api.get(`/alunos?page=${page}&size=${size}`);
    return response.data;
  }
}

export default new AlunoService();
```

---

## 7. Padrão Migration (Flyway)

### 7.1 Estrutura de Migration

```sql
-- V001__criar_tabela_aluno.sql
-- RF-CAD-01: Tabela base de alunos

CREATE TABLE aluno (
  id BIGSERIAL PRIMARY KEY,
  cpf VARCHAR(14) NOT NULL UNIQUE,  -- RF-CAD-03: Unique constraint
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  data_nasc DATE,
  criado_em TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  atualizado_em TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices
CREATE INDEX idx_aluno_cpf ON aluno(cpf);
CREATE INDEX idx_aluno_nome ON aluno(nome);

-- Trigger para auditoria automática (UPDATE timestamp)
CREATE OR REPLACE FUNCTION atualizar_timestamp_aluno()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_aluno_atualizado
BEFORE UPDATE ON aluno
FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp_aluno();
```

---

## 8. Padrão Testes (JUnit5)

### 8.1 Unit Test de Service

```java
@DisplayName("AlunoService")
class AlunoServiceTest {
    
    @Mock
    private AlunoRepository alunoRepository;
    
    @InjectMocks
    private AlunoService alunoService;
    
    @Test
    @DisplayName("RF-CAD-01: Deve cadastrar novo aluno com sucesso")
    void testCadastrarAluno_Sucesso() {
        // Given
        AlunoCadastroDTO dto = new AlunoCadastroDTO(
            "123.456.789-10",
            "João Silva",
            "joao@email.com",
            "(11) 98765-4321",
            LocalDate.of(1990, 1, 1)
        );
        
        Aluno alunoEsperado = Aluno.builder()
            .id(1L)
            .cpf("123.456.789-10")
            .nome("João Silva")
            .build();
        
        when(alunoRepository.findByCpf("123.456.789-10"))
            .thenReturn(Optional.empty());
        
        when(alunoRepository.save(any(Aluno.class)))
            .thenReturn(alunoEsperado);
        
        // When
        Aluno resultado = alunoService.cadastrarAluno(dto, 1L);
        
        // Then
        assertNotNull(resultado);
        assertEquals("123.456.789-10", resultado.getCpf());
        assertEquals("João Silva", resultado.getNome());
        
        verify(alunoRepository, times(1)).save(any(Aluno.class));
    }
    
    @Test
    @DisplayName("RF-CAD-03: Deve rejeitar CPF duplicado")
    void testCadastrarAluno_CPFDuplicado() {
        // Given
        AlunoCadastroDTO dto = new AlunoCadastroDTO(
            "123.456.789-10",
            "Maria",
            "maria@email.com",
            "(11) 91111-1111",
            LocalDate.of(1995, 5, 5)
        );
        
        Aluno alunoExistente = Aluno.builder()
            .id(1L)
            .cpf("123.456.789-10")
            .nome("João")
            .build();
        
        when(alunoRepository.findByCpf("123.456.789-10"))
            .thenReturn(Optional.of(alunoExistente));
        
        // When & Then
        assertThrows(CadastroException.class, () -> {
            alunoService.cadastrarAluno(dto, 1L);
        });
        
        verify(alunoRepository, never()).save(any());
    }
}
```

---

## 9. Encerramento

Usar estes padrões como referência para:
- ✅ Novas entidades
- ✅ Novos endpoints
- ✅ Novos testes
- ✅ Novas features

Desvios requerem aprovação de code review + eng senior.
