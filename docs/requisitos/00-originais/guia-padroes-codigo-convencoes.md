# Guia de Padrões de Código e Convenções — Força Total Academias

> **Versão**: 1.0  
> **Data**: 2 de abril de 2026  
> **Propósito**: Standard de código profissional para evitar bugs, manter consistência, facilitar manutenção  
> **Escopo**: Java Backend, JavaScript/React Frontend, SQL PostgreSQL  
> **Aplicação**: OBRIGATÓRIO em TODAS as PRs (Code Review)

---

## 1. Convenções de Nomenclatura

### 1.1 Java Backend

#### Classes

```java
// ✅ CORRETO
public class AlunoController { }
public class MatriculaService { }
public class CheckinLogRepository { }
public class PasswordValidator { }
public class InvalidCpfException { }

// ❌ ERRADO
public class aluno_controller { }  // snake_case
public class MatriculaServiceImpl { }  // Impl sufixo (use interface)
public class checkInLogRepository { }  // camelCase
public class CHECKINLOGENTITY { }  // UPPER_CASE
```

**Regras**:
- PascalCase (UpperCamelCase)
- Singular (classe representa 1 entidade)
- Sufixo por tipo:
  - Controller: operações HTTP
  - Service: lógica de negócio
  - Repository: acesso a dados
  - Validator: validações
  - Exception: erros, extends `RuntimeException`
  - Dto, Entity, Vo: objetos de transferência
  - Config: configurações
  - Util: utilitários

#### Variáveis e Métodos

```java
// ✅ CORRETO
private String nomeAluno;
private LocalDateTime dataMatricula;
private boolean ativo;
private List<Matricula> matriculas;

public Matricula buscarMatriclaPorId(Long id) { }
public void validarCpf(String cpf) throws InvalidCpfException { }
public boolean isAlunoAtivo(Long alunoId) { }

// ❌ ERRADO
private String nome_aluno;  // snake_case
private String NomeAluno;  // PascalCase
private LocalDateTime data_mat;  // abreviação
private Boolean ativo;  // Boolean primitivo (use boolean)
private ArrayList<Matricula> matriculas;  // implementação exposta

public Matricula buscarMatricula(Long id) { }  // genérico
public void validar(String cpf) { }  // verbo genérico
```

**Regras**:
- camelCase
- Variáveis booleanas: prefixo `is`, `has`, `should` (ex: `isAtivo`, `hasPlano`)
- Métodos: verbo + substantivo (ex: `buscarAluno`, `validarCpf`, `criarMatricula`)
- Getter: `get` + atributo (ex: `getAlunoId()`)
- Setter: `set` + atributo (ex: `setNomeAluno()`)
- Método que retorna boolean: `is`, `has`, `can` (ex: `isValid()`)

#### Constantes

```java
// ✅ CORRETO
private static final int DIAS_CARENCIA_PADRAO = 5;
private static final String CPF_REGEX = "^\\d{11}$";
private static final LocalTime HORARIO_RESET_SISTEMA = LocalTime.of(2, 0);

// ❌ ERRADO
private static final int diasCarencia = 5;  // camelCase
private static final int DIAS_CARENCIA = 5;  // misturado em classe
public static final String CPF_PATTERN = "[0-9]{11}";  // inconsistente
```

**Regras**:
- UPPER_SNAKE_CASE
- `private static final` (nunca `public static`)
- Definidas em classe Config ou enum separados
- Documentar significado com JavaDoc

#### Enums

```java
// ✅ CORRETO
public enum StatusMatricula {
    ATIVO("Aluno ativo, sem pendências"),
    SUSPENSO("Aluno suspenso por disciplina"),
    INADIMPLENTE("Aluno com pagamento atrasado"),
    CANCELADO("Aluno com matrícula cancelada");

    private final String descricao;

    StatusMatricula(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}

// ❌ ERRADO
public enum Status {
    ATIVO, SUSPENSO, INADIMPLENTE;  // sem descrição
}

public enum statusMatricula {  // camelCase
    ativo, suspenso;
}
```

**Regras**:
- PascalCase para enum, UPPER_CASE para valores
- Sempre com descrição/javadoc
- Um por arquivo (ex: `StatusMatricula.java`)

#### Pacotes

```
// ✅ CORRETO
com.forcatotal.academias.controller
com.forcatotal.academias.service
com.forcatotal.academias.repository
com.forcatotal.academias.entity
com.forcatotal.academias.dto
com.forcatotal.academias.exception
com.forcatotal.academias.config
com.forcatotal.academias.util
com.forcatotal.academias.validation

// ❌ ERRADO
com.forcatotal.ACADEMIAS.controller  // UPPER_CASE
com.forcatotal.academias_api.service  // snake_case
com.*academias.models  // modelo genérico
```

**Regras**:
- Lowercase, dot-separated
- Estrutura: `com.forcatotal.academias.[dominio].[tipo]`
- 1 classe por arquivo
- Ordem alfabética em imports

---

### 1.2 JavaScript/React Frontend

#### Componentes

```javascript
// ✅ CORRETO - Arquivo: AlunoForm.jsx
export function AlunoForm({ onSubmit }) {
  const [nomeAluno, setNomeAluno] = useState('');
  const [cpf, setCpf] = useState('');
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={nomeAluno} onChange={e => setNomeAluno(e.target.value)} />
    </form>
  );
}

// ❌ ERRADO
export function aluno_form({ onSubmit }) { }  // snake_case
export function AlunoFormComponent({ }) { }  // sufixo Component
export const AlunoForm = () => { }  // arrow function sem estilização
```

**Regras**:
- PascalCase de arquivo e função
- `function` para clareza (não arrow function)
- 1 componente por arquivo
- Arquivo com mesmo nome do componente (ex: `AlunoForm.jsx`)

#### Variáveis e Funções

```javascript
// ✅ CORRETO
const [alunosList, setAlunosList] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState('');

const handleSubmitForm = async (data) => { }
const validateCpf = (cpf) => { }
const fetchAlunoDetails = async (id) => { }

// ❌ ERRADO
const [alunos, setAlunos] = useState([]);  // ambíguo sem 'List'
const [loading, setLoading] = useState(false);  // sem 'is' para boolean
const data = useState([]);  // useState sem destructuring
const onSubmit = () => { }  // genérico, sem 'handle'
```

**Regras**:
- camelCase
- Booleanos: prefixo `is`, `has`, `should` (ex: `isLoading`, `hasError`)
- Handlers: `handle` + evento (ex: `handleSubmit`, `handleInputChange`)
- Funções assíncronas: prefixo `fetch` (ex: `fetchAlunoDetails`)
- Array: plural ou sufixo `List` (ex: `alunosList`)

#### Constantes

```javascript
// ✅ CORRETO - Arquivo: constants.js
export const DIAS_CARENCIA_PADRAO = 5;
export const MAX_TENTATIVAS_LOGIN = 5;
export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const TIMEOUT_REQUEST_MS = 30000;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// ❌ ERRADO
export const diasCarencia = 5;  // camelCase
const MAX_DIAS = 5;  // sem contexto
export const TIMEOUT = 30000;  // vago sem _MS
```

**Regras**:
- UPPER_SNAKE_CASE
- Definidas em arquivo `constants.js`
- Agrupar por tema em objetos (ex: `HTTP_STATUS`)
- Usar sufixos para unidades (ex: `_MS`, `_PIXELS`)

#### Pastas e Estrutura

```
src/
├── components/        # Componentes React reutilizáveis
│   ├── AlunoForm.jsx
│   ├── CheckinCard.jsx
│   └── Dashboard.jsx
├── pages/            # Páginas (rotas)
│   ├── AlunoListPage.jsx
│   └── DashboardPage.jsx
├── hooks/            # Custom hooks
│   ├── useAlunos.js
│   └── useAuth.js
├── services/         # Chamadas a API
│   ├── alunoService.js
│   └── checkinService.js
├── store/            # Redux/Zustand state
│   ├── alunoSlice.js
│   └── store.js
├── utils/            # Funções utilitárias
│   ├── validation.js
│   └── formatters.js
├── constants.js      # Constantes globais
├── styles/          # CSS/SCSS globais
└── App.jsx
```

**Regras**:
- lowercase para pastas
- PascalCase para componentes `.jsx`
- camelCase para funções `.js`
- 1 componente por pasta (com index se houver subcomponentes)

---

### 1.3 SQL — PostgreSQL

#### Naming

```sql
-- ✅ CORRETO
CREATE TABLE aluno (
    aluno_id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_aluno_cpf ON aluno(cpf);
CREATE INDEX idx_aluno_criado_em ON aluno(criado_em DESC);

-- ❌ ERRADO
CREATE TABLE Aluno (  -- PascalCase
    alunoId SERIAL PRIMARY KEY,  -- camelCase
    NOME VARCHAR(255),  -- UPPER_CASE
    CPF_NUMERO CHAR(11),  -- redundante
    is_active BOOLEAN,  -- english
);

CREATE INDEX aluno_cpf ON aluno(cpf);  -- sem prefixo idx
```

**Regras**:
- Todo lowercase + underscore (snake_case)
- Tabelas: singular (ex: `aluno` não `alunos`)
- Colunas: `tabela_id` para chave primária
- FK: `referencia_tabela_id` (ex: `academia_id`)
- Índices: `idx_tabela_coluna` (ex: `idx_aluno_cpf`)
- Booleanos: coluna sem sufixo `is_` (ex: `ativo` não `is_ativo`)
- Timestamps: `criado_em`, `atualizado_em` (não `created_at`, `updated_at`)

#### Tipos de Dados

```sql
-- ✅ CORRETO
CREATE TABLE matricula (
    matricula_id BIGSERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES aluno(aluno_id),
    academia_id SMALLINT NOT NULL,
    data_matricula DATE NOT NULL,
    data_vencimento DATE,
    valor_mensal NUMERIC(10, 2),
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ❌ ERRADO
CREATE TABLE matricula (
    id SERIAL,  -- sem PK explícito
    aluno_id INT REFERENCES aluno(id),  -- INT ao invés BIGINT
    valor FLOAT,  -- FLOAT para dinheiro (perda de precisão)
    data_vencimento TIMESTAMP,  -- use DATE para datas
    notas VARCHAR(MAX),  -- MAX é SQL Server
);
```

**Regras**:
- BIGSERIAL para IDs (suporta 9 bilhões)
- NUMERIC(10,2) para dinheiro (não FLOAT)
- DATE para datas (não TIMESTAMP)
- TIMESTAMP WITH TIME ZONE para auditoria
- TEXT para strings ilimitadas (VARCHAR para limite)
- BOOLEAN para flags (não INT 0/1)

---

## 2. Padrões de Design e Arquitetura

### 2.1 Backend — Camadas SOLID

#### Camada Entity (Modelo de Dados)

```java
// ✅ CORRETO
@Entity
@Table(name = "aluno")
public class AlunoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aluno_id")
    private Long id;

    @Column(name = "nome_completo", nullable = false, length = 255)
    private String nomeCompleto;

    @Column(name = "cpf", unique = true, nullable = false, length = 11)
    private String cpf;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL)
    private List<MatriculaEntity> matriculas = new ArrayList<>();

    // Getters, Setters, hashCode, equals
}

// ❌ ERRADO
public class Aluno {  // sem Entity sufixo
    public Long id;  // public
    public String nome;  // sem column annotation
    public List matriculas;  // raw type
    public Aluno() { }  // sem lombok @NoArgsConstructor
}
```

**Regras**:
- Sufixo `Entity` para diferenciar de DTO
- Sempre com `@Id` e `@GeneratedValue`
- `@Column` com constraints (nullable, unique, length)
- Never public fields (use getters/setters com Lombok)
- `@ManyToOne`, `@OneToMany` com `mappedBy`
- Só JPA annotations (não validação, não Spring)

#### Camada DTO (Transfer Object)

```java
// ✅ CORRETO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlunoCreateDto {
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 255)
    private String nomeCompleto;

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "^\\d{11}$", message = "CPF inválido")
    private String cpf;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "Data deve ser no passado")
    private LocalDate dataNascimento;
}

@Data  // Lombok para getters, setters, equals, hashCode, toString
public class AlunoResponseDto {
    private Long id;
    private String nomeCompleto;
    private String cpf;
    private LocalDate dataNascimento;
    private Boolean ativo;
}

// ❌ ERRADO
public class AlunoDTO {  // sem sufixo específico
    public String nome;  // public field
    public LocalDate dataNascimento;  // sem @NotNull
    @Deprecated
    private String oldField;  // obsoleto não removido
}
```

**Regras**:
- Separar por operação: `CreateDto`, `UpdateDto`, `ResponseDto`
- Usar Lombok (`@Data`, `@Builder`)
- Validações com `javax.validation` (ex: `@NotBlank`, `@Pattern`)
- Nunca referenciar Entity ou outra tabela (flattened)

#### Camada Service (Lógica de Negócio)

```java
// ✅ CORRETO
@Service
@Transactional
@Slf4j
public class AlunoService {
    
    private final AlunoRepository alunoRepository;
    private final CpfValidator cpfValidator;
    private final AlunoMapper alunoMapper;

    public AlunoService(AlunoRepository alunoRepository, 
                        CpfValidator cpfValidator,
                        AlunoMapper alunoMapper) {
        this.alunoRepository = alunoRepository;
        this.cpfValidator = cpfValidator;
        this.alunoMapper = alunoMapper;
    }

    public AlunoResponseDto criarAluno(AlunoCreateDto dto) {
        // Validação
        if (!cpfValidator.isValid(dto.getCpf())) {
            throw new InvalidCpfException("CPF inválido: " + dto.getCpf());
        }

        // Verificar duplicata
        if (alunoRepository.existsByCpf(dto.getCpf())) {
            throw new AlunoDuplicadoException("Aluno com CPF já cadastrado");
        }

        // Criar entidade
        AlunoEntity entity = alunoMapper.toEntity(dto);
        
        // Salvar
        AlunoEntity saved = alunoRepository.save(entity);
        
        // Retornar DTO
        return alunoMapper.toResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public AlunoResponseDto buscarAlunoPorId(Long id) {
        return alunoRepository
            .findById(id)
            .map(alunoMapper::toResponseDto)
            .orElseThrow(() -> new AlunoNaoEncontradoException("ID: " + id));
    }

    public void validarBloqueioCpf(String cpf) {
        AlunoEntity aluno = alunoRepository.findByCpf(cpf)
            .orElseThrow(() -> new AlunoNaoEncontradoException("CPF: " + cpf));
        
        if (!aluno.getAtivo()) {
            throw new AlunoInativoException("Aluno inativo: " + cpf);
        }
    }
}

// ❌ ERRADO
public class AlunoService {
    @Autowired
    private AlunoRepository repo;  // field injection
    
    public AlunoResponseDto criar(AlunoCreateDto dto) {
        // SQL direto
        String sql = "INSERT INTO aluno VALUES (...)";
        // Sem transação
        // Sem logging
        return null;
    }
}
```

**Regras**:
- `@Service` + `@Transactional`
- Constructor injection (não `@Autowired` field)
- Separar negócio de acesso a dados
- Sempre validar entrada
- Lançar exceções customizadas
- Logging com `@Slf4j` (ex: `log.info()`)
- `readOnly = true` em queries

#### Camada Repository (Acesso a Dados)

```java
// ✅ CORRETO
@Repository
public interface AlunoRepository extends JpaRepository<AlunoEntity, Long> {
    
    Optional<AlunoEntity> findByCpf(String cpf);
    
    boolean existsByCpf(String cpf);
    
    List<AlunoEntity> findAllByAtivoTrue();
    
    @Query("SELECT a FROM AlunoEntity a WHERE a.cpf = :cpf AND a.ativo = true")
    Optional<AlunoEntity> findByCpfAndAtivoTrue(@Param("cpf") String cpf);
    
    @Query(value = "SELECT * FROM aluno WHERE data_criacao > :data LIMIT 100", 
           nativeQuery = true)
    List<AlunoEntity> findRecentAlunos(@Param("data") LocalDateTime data);
}

// ❌ ERRADO
public class AlunoRepository {
    @Autowired
    private JdbcTemplate jdbc;
    
    public List<Aluno> buscarTodos() {
        String sql = "SELECT * FROM aluno";  // sem paginação
        return jdbc.query(sql, ...);  // SQL injection risk
    }
}
```

**Regras**:
- Interface extends `JpaRepository<Entity, ID>`
- Query methods pela convenção (ex: `findBy`, `existsBy`)
- `@Query` apenas se complexo
- Sempre retornar `Optional` para buscas
- Paginação com `Pageable`
- Nativequery apenas se JPQL não resolve

#### Camada Controller (HTTP)

```java
// ✅ CORRETO
@RestController
@RequestMapping("/api/v1/alunos")
@Validated
@Slf4j
public class AlunoController {
    
    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlunoResponseDto criarAluno(@Valid @RequestBody AlunoCreateDto dto) {
        log.info("Criando novo aluno: {}", dto.getCpf());
        return alunoService.criarAluno(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDto> buscarAluno(@PathVariable Long id) {
        log.debug("Buscando aluno ID: {}", id);
        AlunoResponseDto aluno = alunoService.buscarAlunoPorId(id);
        return ResponseEntity.ok(aluno);
    }

    @PutMapping("/{id}")
    public AlunoResponseDto atualizarAluno(
            @PathVariable Long id,
            @Valid @RequestBody AlunoUpdateDto dto) {
        log.info("Atualizando aluno ID: {}", id);
        return alunoService.atualizarAluno(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarAluno(@PathVariable Long id) {
        log.info("Deletando aluno ID: {}", id);
        alunoService.deletarAluno(id);
    }
}

// ❌ ERRADO
public class AlunoController {
    @GetMapping("/alunos")  // plurar na rota
    public List buscarTodos() { }  // sem DTO, raw types
    
    @PostMapping
    public void criar(AlunoCreateDto dto) { }  // sem @Valid, sem @ResponseStatus
    
    @DeleteMapping
    public void delete(Long id) { }  // sem @PathVariable
}
```

**Regras**:
- `@RestController` + `@RequestMapping` (versionado: `/v1/`)
- `@Valid` em todos DTOs de entrada
- `@ResponseStatus` apropriado (201 CREATED, 204 NO_CONTENT)
- Retornar `ResponseEntity` para controle fino
- Path parameters em URL (`@PathVariable`)
- Query parameters em query (`@RequestParam`)
- Logging de entrada/saída

---

### 2.2 Frontend — React Hooks Pattern

#### Custom Hook com Validação

```javascript
// ✅ CORRETO - useAlunos.js
import { useState, useCallback } from 'react';
import * as alunoService from '../services/alunoService';

export function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAlunos = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await alunoService.listarAlunos();
      setAlunos(data);
    } catch (error) {
      setErrorMessage('Erro ao buscar alunos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const criarAluno = useCallback(async (dto) => {
    try {
      setIsLoading(true);
      const novoAluno = await alunoService.criarAluno(dto);
      setAlunos(prev => [...prev, novoAluno]);
      return novoAluno;
    } catch (error) {
      setErrorMessage('Erro ao criar aluno: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { alunos, isLoading, errorMessage, fetchAlunos, criarAluno };
}

// ✅ CORRETO - AlunoForm.jsx
export function AlunoForm({ onSuccess }) {
  const { isLoading, errorMessage, criarAluno } = useAlunos();
  const [formData, setFormData] = useState({ nomeCompleto: '', cpf: '' });
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar
    const errors = validateAlunoForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await criarAluno(formData);
      setFormData({ nomeCompleto: '', cpf: '' });
      onSuccess?.();
    } catch (error) {
      // erro já em estado
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nomeCompleto"
        value={formData.nomeCompleto}
        onChange={e => setFormData(prev => ({ ...prev, nomeCompleto: e.target.value }))}
        disabled={isLoading}
      />
      {validationErrors.nomeCompleto && <span>{validationErrors.nomeCompleto}</span>}
      
      {errorMessage && <div className="error">{errorMessage}</div>}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Criar Aluno'}
      </button>
    </form>
  );
}

// ❌ ERRADO
export function AlunoForm() {
  const [alunos, setAlunos] = useState([]);
  
  const criar = () => {
    // Sem try/catch
    fetch('/api/alunos', { method: 'POST', body: JSON.stringify(data) })
      .then(res => res.json())
      .then(data => setAlunos([...alunos, data]));  // sem loading state
  };
}
```

**Regras**:
- Custom hooks para lógica reutilizável
- State: `[value, setValue]` + `isLoading` + `errorMessage`
- Sempre com `try/catch`
- `useCallback` para funções memoizadas
- Validação client-side antes de enviar
- Desabilitar botões durante loading

---

## 3. Tratamento de Erros e Exceções

### 3.1 Exceções Customizadas (Backend)

```java
// ✅ CORRETO
// Classe Base
public abstract class BaseException extends RuntimeException {
    private final String codigo;
    private final int httpStatus;

    public BaseException(String codigo, String mensagem, int httpStatus) {
        super(mensagem);
        this.codigo = codigo;
        this.httpStatus = httpStatus;
    }

    public String getCodigo() { return codigo; }
    public int getHttpStatus() { return httpStatus; }
}

// Específicas por Domínio
public class AlunoNaoEncontradoException extends BaseException {
    public AlunoNaoEncontradoException(String id) {
        super("ALUNO_NAO_ENCONTRADO", "Aluno ID: " + id + " não existe", 404);
    }
}

public class InvalidCpfException extends BaseException {
    public InvalidCpfException(String cpf) {
        super("CPF_INVALIDO", "CPF inválido: " + cpf, 400);
    }
}

public class AlunoDuplicadoException extends BaseException {
    public AlunoDuplicadoException(String cpf) {
        super("ALUNO_DUPLICADO", "Aluno com CPF + cpf + já existe", 409);
    }
}

// Global Exception Handler
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponseDto> handleBaseException(BaseException ex) {
        log.error("Business error: [{}] {}", ex.getCodigo(), ex.getMessage());
        
        return ResponseEntity
            .status(ex.getHttpStatus())
            .body(new ErrorResponseDto(
                ex.getCodigo(),
                ex.getMessage(),
                LocalDateTime.now()
            ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidation(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining("; "));
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponseDto(
                "VALIDACAO_FALHOU",
                errors,
                LocalDateTime.now()
            ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);
        
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponseDto(
                "ERRO_INTERNO",
                "Erro interno do servidor",
                LocalDateTime.now()
            ));
    }
}

// ❌ ERRADO
public void criar(AlunoCreateDto dto) {
    if (dto.getCpf() == null) {
        throw new RuntimeException("CPF é obrigatório");  // genérica
    }
    if (alunoRepository.existsByCpf(dto.getCpf())) {
        return null;  // sem exceção
    }
}
```

**Regras**:
- Criar exceção por tipo de erro
- Incluir código único (ex: `ALUNO_NAO_ENCONTRADO`)
- Mapear para HTTP status correto (404, 400, 409, 500)
- Global exception handler centralizado
- Nunca lançar `RuntimeException` genérica
- Log com `@Slf4j`

### 3.2 Tratamento Frontend

```javascript
// ✅ CORRETO - errorHandling.js
export const HTTP_ERRORS = {
  400: 'Requisição inválida',
  401: 'Não autorizado',
  403: 'Acesso negado',
  404: 'Não encontrado',
  409: 'Conflito (recurso duplicado)',
  500: 'Erro interno do servidor',
  999: 'Erro de conectividade',
};

export async function handleApiError(error) {
  if (error.response) {
    // Erro HTTP
    const status = error.response.status;
    const data = error.response.data;
    
    return {
      codigo: data.codigo || 'ERRO_DESCONHECIDO',
      mensagem: data.mensagem || HTTP_ERRORS[status] || 'Erro desconhecido',
      status,
    };
  } else if (error.request) {
    // Sem resposta
    return {
      codigo: 'ERRO_CONECTIVIDADE',
      mensagem: 'Falha ao conectar ao servidor',
      status: 999,
    };
  } else {
    // Erro local
    return {
      codigo: 'ERRO_LOCAL',
      mensagem: error.message,
      status: 0,
    };
  }
}

// Em componente
const { isLoading, errorMessage, fetchAlunos } = useAlunos();

const handleFetch = async () => {
  try {
    setIsLoading(true);
    const data = await alunoService.listar();
    setAlunos(data);
  } catch (error) {
    const { mensagem } = handleApiError(error);
    setErrorMessage(mensagem);  // mensagem user-friendly
  } finally {
    setIsLoading(false);
  }
};

// ❌ ERRADO
fetch('/api/alunos')
  .then(res => res.json())
  .catch(err => {
    console.log(err);  // sem tratamento real
    alert('Erro');  // alert é ruim
  });
```

**Regras**:
- Mapear HTTP status para mensagens claras
- Diferenciar erro de conectividade vs aplicação
- Sempre mostrar mensagem ao usuário
- Nunca usar `alert()` (usar toast/modal)
- Log de erro para debug

---

## 4. Validação de Dados

### 4.1 Backend Validation

```java
// ✅ CORRETO - Validators
@Component
public class CpfValidator {
    public boolean isValid(String cpf) {
        if (cpf == null || cpf.length() != 11 || !cpf.matches("\\d+")) {
            return false;
        }
        // Algoritmo mod 11
        int sum = 0;
        int remainder;
        
        for (int i = 1; i <= 9; i++) {
            sum += Integer.parseInt(String.valueOf(cpf.charAt(i - 1))) * (11 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder == 10 || remainder == 11) remainder = 0;
        if (remainder != Integer.parseInt(String.valueOf(cpf.charAt(9)))) return false;

        sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += Integer.parseInt(String.valueOf(cpf.charAt(i - 1))) * (12 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder == 10 || remainder == 11) remainder = 0;
        return remainder == Integer.parseInt(String.valueOf(cpf.charAt(10)));
    }
}

// No Service
public void criar(AlunoCreateDto dto) {
    // Validação de negócio (lógica)
    if (!cpfValidator.isValid(dto.getCpf())) {
        throw new InvalidCpfException(dto.getCpf());
    }

    if (alunoRepository.existsByCpf(dto.getCpf())) {
        throw new AlunoDuplicadoException(dto.getCpf());
    }
}

// No DTO (validação de formato)
@Data
public class AlunoCreateDto {
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 255)
    private String nomeCompleto;

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "^\\d{11}$", message = "CPF deve ter 11 dígitos")
    private String cpf;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "Data deve ser no passado")
    private LocalDate dataNascimento;
}

// ❌ ERRADO
if (dto.getNomeCompleto() == null || dto.getNomeCompleto().isEmpty()) {
    throw new Exception("Nome obrigatório");  // sem @NotBlank
}

if (dto.getCpf().length() != 11) {  // validação não completa
    throw new Exception("CPF inválido");
}
```

**Regras**:
- Validação de formato: DTO com `javax.validation` (JSR-380)
- Validação de negócio: Service com lógica customizada
- Sempre validate em ambos os níveis
- Mensagens de erro descritivas

### 4.2 Frontend Validation

```javascript
// ✅ CORRETO - validation.js
export const VALIDATION_RULES = {
  nomeCompleto: {
    required: 'Nome é obrigatório',
    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
    maxLength: { value: 255, message: 'Máximo 255 caracteres' },
    pattern: { value: /^[a-zA-Zçñáéíóúàâêô\s]+$/, message: 'Apenas letras' },
  },
  cpf: {
    required: 'CPF é obrigatório',
    pattern: { value: /^\d{11}$/, message: 'CPF deve ter 11 dígitos' },
    validate: validateCpfAlgorithm,  // função customizada
  },
  email: {
    required: 'Email é obrigatório',
    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email inválido' },
  },
};

export function validateCpfAlgorithm(cpf) {
  if (!cpf || cpf.length !== 11) return 'CPF deve ter 11 dígitos';
  
  // Algoritmo mod 11
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return 'CPF inválido';
  
  return true;
}

export function validateAlunoForm(formData) {
  const errors = {};
  
  if (!formData.nomeCompleto || formData.nomeCompleto.trim().length < 3) {
    errors.nomeCompleto = 'Nome deve ter mínimo 3 caracteres';
  }
  
  if (!formData.cpf || !formData.cpf.match(/^\d{11}$/)) {
    errors.cpf = 'CPF deve ter 11 dígitos';
  }
  
  return errors;
}

// Em componente  com react-hook-form
import { useForm, Controller } from 'react-hook-form';

export function AlunoForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="nomeCompleto"
        control={control}
        rules={VALIDATION_RULES.nomeCompleto}
        render={({ field }) => (
          <div>
            <input {...field} placeholder="Nome completo" />
            {errors.nomeCompleto && <span className="error">{errors.nomeCompleto.message}</span>}
          </div>
        )}
      />

      <Controller
        name="cpf"
        control={control}
        rules={VALIDATION_RULES.cpf}
        render={({ field }) => (
          <div>
            <input {...field} placeholder="CPF" maxLength={11} />
            {errors.cpf && <span className="error">{errors.cpf.message}</span>}
          </div>
        )}
      />

      <button type="submit">Enviar</button>
    </form>
  );
}

// ❌ ERRADO
<input
  value={nome}
  onChange={e => setNome(e.target.value)}
/>
// sem validação, sem feedback

if (nome.length < 3) {
  console.log("Nome inválido");  // sem feedback ao usuário
}
```

**Regras**:
- Validação client-side para UX rápida
- Sempre validar server-side (nunca confiar no cliente)
- Usar bibliotecas: `react-hook-form` + `zod` ou `yup`
- Feedback imediato (onBlur)
- Mensagens claras em português

---

## 5. Logging e Debugging

### 5.1 Backend Logging

```java
// ✅ CORRETO - Com @Slf4j
@Service
@Slf4j
public class AlunoService {
    
    public AlunoResponseDto criarAluno(AlunoCreateDto dto) {
        log.info("Iniciando criação de aluno com CPF: {}", dto.getCpf());
        
        try {
            // Validação
            if (!cpfValidator.isValid(dto.getCpf())) {
                log.warn("CPF inválido: {}", dto.getCpf());
                throw new InvalidCpfException(dto.getCpf());
            }

            // Verificar duplicata
            if (alunoRepository.existsByCpf(dto.getCpf())) {
                log.warn("Tentativa de criar aluno duplicado: {}", dto.getCpf());
                throw new AlunoDuplicadoException(dto.getCpf());
            }

            // Criar
            AlunoEntity entity = alunoMapper.toEntity(dto);
            AlunoEntity saved = alunoRepository.save(entity);
            
            log.info("Aluno criado com sucesso ID: {}", saved.getId());
            return alunoMapper.toResponseDto(saved);
            
        } catch (BaseException ex) {
            log.error("Erro de negócio ao criar aluno: [{}] {}", ex.getCodigo(), ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Erro inesperado ao criar aluno", ex);  // com stack trace
            throw new Exception("Erro interno", ex);
        }
    }
}

// application.yml
logging:
  level:
    com.forcatotal: DEBUG
    org.springframework.web: INFO
    org.hibernate.SQL: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/application.log
    max-size: 10MB
    max-history: 30

// ❌ ERRADO
System.out.println("Aluno criado: " + aluno);  // System.out
e.printStackTrace();  // printStackTrace
log.debug("" + aluno);  // sem mensagem context
```

**Regras**:
- Usar `@Slf4j` (Lombok annotation)
- Níveis: `info` (eventos), `warn` (potencial problema), `error` (erro)
- Debug apenas em DEV
- Nunca logar senhas ou dados sensíveis
- Context estruturado (ex: `[CPF: {}]`)
- Configurar por classe/pacote

### 5.2 Frontend Debugging

```javascript
// ✅ CORRETO - desenvolvimento
const DEBUG = process.env.NODE_ENV === 'development';

export function debugLog(component, message, data) {
  if (DEBUG) {
    console.log(`[${component}] ${message}`, data);
  }
}

export function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  
  useEffect(() => {
    debugLog('useAlunos', 'Mounting, fetching alunos');
    
    fetchAlunos()
      .then(data => {
        debugLog('useAlunos', 'Fetch successful', { count: data.length });
        setAlunos(data);
      })
      .catch(error => {
        console.error('[useAlunos] Fetch failed:', error);
      });
  }, []);
}

// No terminal
export function AlunoForm() {
  const handleSubmit = (data) => {
    console.log('[AlunoForm] Submitting:', data);  // desenvolvimento
    // Enviar
  };
}

// ❌ ERRADO
console.log(alunos);  // sem contexto
alert("Debug: " + data);  // alert
debugger;  // deixar no código (usar DevTools)
```

**Regras**:
- Usar console.log em DEV (disabled em PROD)
- Contexto sempre: `[NomeComponente]`
- Nunca commitar `debugger;`
- React DevTools para state inspection
- Never console.log senhas/tokens

---

## 6. Testes

### 6.1 Backend Tests

```java
// ✅ CORRETO - AlunoServiceTest.java
@ExtendWith(MockitoExtension.class)
class AlunoServiceTest {
    
    @Mock
    private AlunoRepository alunoRepository;
    
    @Mock
    private CpfValidator cpfValidator;
    
    @Mock
    private AlunoMapper alunoMapper;
    
    @InjectMocks
    private AlunoService alunoService;

    @Test
    void deveCriarAlunoComDadosValidos() {
        // Arrange
        AlunoCreateDto dto = new AlunoCreateDto();
        dto.setNomeCompleto("João Silva");
        dto.setCpf("12345678901");
        
        AlunoEntity entity = new AlunoEntity();
        entity.setId(1L);
        entity.setNomeCompleto("João Silva");
        
        when(cpfValidator.isValid("12345678901")).thenReturn(true);
        when(alunoRepository.existsByCpf("12345678901")).thenReturn(false);
        when(alunoMapper.toEntity(dto)).thenReturn(entity);
        when(alunoRepository.save(any())).thenReturn(entity);
        when(alunoMapper.toResponseDto(entity)).thenReturn(/* DTO */);

        // Act
        AlunoResponseDto resultado = alunoService.criarAluno(dto);

        // Assert
        assertNotNull(resultado);
        verify(alunoRepository, times(1)).save(any());
    }

    @Test
    void deveThrowInvalidCpfExceptionQuandoCpfInvalido() {
        // Arrange
        AlunoCreateDto dto = new AlunoCreateDto();
        dto.setCpf("00000000000");
        
        when(cpfValidator.isValid("00000000000")).thenReturn(false);

        // Act & Assert
        assertThrows(InvalidCpfException.class, () -> alunoService.criarAluno(dto));
        verify(alunoRepository, never()).save(any());
    }

    @Test
    void deveThrowAlunoDuplicadoExceptionQuandoJaExiste() {
        // Arrange
        AlunoCreateDto dto = new AlunoCreateDto();
        dto.setCpf("12345678901");
        
        when(cpfValidator.isValid("12345678901")).thenReturn(true);
        when(alunoRepository.existsByCpf("12345678901")).thenReturn(true);

        // Act & Assert
        assertThrows(AlunoDuplicadoException.class, () -> alunoService.criarAluno(dto));
    }
}

// ✅ CORRETO - Integration Test
@SpringBootTest
@AutoConfigureMockMvc
class AlunoControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;

    @Test
    void deveCriarAlunoViaAPI() throws Exception {
        AlunoCreateDto dto = new AlunoCreateDto();
        dto.setNomeCompleto("Maria Silva");
        dto.setCpf("98765432101");

        mockMvc.perform(post("/api/v1/alunos")
                .contentType("application/json")
                .content(new ObjectMapper().writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void deveBuscarAlunoPorId() throws Exception {
        mockMvc.perform(get("/api/v1/alunos/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));
    }
}

// ❌ ERRADO
public void testCriarAluno() {  // sem padrão Arrange/Act/Assert
    AlunoService service = new AlunoService();  // sem Mock
    service.criar(dto);  // sem assert
}
```

**Regras**:
- Padrão AAA: Arrange, Act, Assert
- Mock externos (BD, APIs)
- 1 teste por cenário
- Nome descritivo: `deve[Resultado]Quando[Condição]`
- Cobertura ≥ 80%
- Testes rápidos (< 100ms)

### 6.2 Frontend Tests

```javascript
// ✅ CORRETO - AlunoForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlunoForm } from './AlunoForm';

describe('AlunoForm', () => {
  it('deve renderizar formulário com campos obrigatórios', () => {
    render(<AlunoForm />);
    
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('deve exibir erro quando CPF inválido', async () => {
    render(<AlunoForm />);
    
    const cpfInput = screen.getByLabelText(/cpf/i);
    fireEvent.change(cpfInput, { target: { value: '123' } });
    fireEvent.blur(cpfInput);

    await waitFor(() => {
      expect(screen.getByText(/cpf deve ter 11 dígitos/i)).toBeInTheDocument();
    });
  });

  it('deve enviar formulário com dados válidos', async () => {
    const mockOnSuccess = jest.fn();
    render(<AlunoForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'João Silva' },
    });
    fireEvent.change(screen.getByLabelText(/cpf/i), {
      target: { value: '12345678901' },
    });

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});

// ✅ CORRETO - Hook Test
import { renderHook, act } from '@testing-library/react';
import { useAlunos } from './useAlunos';

describe('useAlunos', () => {
  it('deve buscar alunos ao montar', async () => {
    const { result } = renderHook(() => useAlunos());

    await act(async () => {
      await result.current.fetchAlunos();
    });

    expect(result.current.alunos.length).toBeGreaterThan(0);
  });
});

// ❌ ERRADO
test('form test', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AlunoForm />, div);  // sem testing-library
});

test('test', () => {
  // sem descrição clara
  // sem asserts reais
});
```

**Regras**:
- Usar `@testing-library/react`
- Testar comportamento (não implementação)
- Snapshot tests apenas para componentes estáveis
- Cobertura ≥ 80%
- Testes isolados (sem ordem)

---

## 7. Segurança

### 7.1 Backend Security

```java
// ✅ CORRETO - SecurityConfig.java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()  // CORS via @CrossOrigin
            .authorizeRequests()
                .antMatchers("/api/v1/auth/**").permitAll()  // login sem auth
                .antMatchers("/api/v1/alunos/**").authenticated()
                .anyRequest().authenticated()
            .and()
            .httpBasic().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .cors().configurationSource(corsConfigurationSource());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);  // cost=10
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("https://app.forcatotal.com"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

// JwtAuthenticationFilter (validar token)
@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = extractToken(request);
            if (token != null && jwtUtil.isValid(token)) {
                Long userId = jwtUtil.extractUserId(token);
                // set authentication
            }
        } catch (JwtException ex) {
            log.warn("Invalid JWT: {}", ex.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}

// ❌ ERRADO
public class LoginController {
    @PostMapping
    public String login(String email, String password) {
        User user = repo.findByEmail(email);
        if (user.getPassword().equals(password)) {  // plain text!
            return generateToken(user);
        }
    }
}
```

**Regras**:
- BCrypt cost=10+ para senhas
- JWT token com expiração (5min)
- HTTPS/TLS 1.2+ obrigatório
- CORS restrito a domínios conhecidos
- Rate limiting em login
- Nunca logar senhas ou tokens
- Input validation + output encoding

### 7.2 Frontend Security

```javascript
// ✅ CORRETO - Armazenar token com segurança
// Nunca localStorage (XSS vulnerability)
// Use sessionStorage (mesmo contexto, melhor que cookie)

// Ou melhor: HttpOnly cookie (servidor controla)
export function storeToken(token) {
  // Opção 1: sessionStorage (melhor)
  sessionStorage.setItem('authToken', token);
  
  // Opção 2: Cookie HttpOnly (requer backend)
  // Cookie é set pelo servidor, frontend não acessa direto
}

export function getToken() {
  return sessionStorage.getItem('authToken');
}

export function logout() {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('refreshToken');
}

// API Interceptor
export function setupAxios() {
  axios.interceptors.request.use(
    config => {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }
  );

  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}

// ✅ CORRETO - Sanitizar input
import DOMPurify from 'dompurify';

export function renderUserContent(html) {
  const cleanHtml = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}

// ✅ CORRETO - HTTPS enforcement
const API_URL = 'https://api.forcatotal.com';  // nunca http em PROD

// ❌ ERRADO
localStorage.setItem('authToken', token);  // XSS vulnerability!
axios.defaults.headers.Authorization = `Bearer ${token}`;  // exposto em JS

<div dangerouslySetInnerHTML={{ __html: userContent }} />  // XSS!

const API_URL = process.env.REACT_APP_API_URL;  // pode ser http
```

**Regras**:
- Token em sessionStorage (ou HttpOnly cookie)
- Nunca localStorage para tokens
- HTTPS sempre
- Sanitize user content (DOMPurify)
- Rate limiting client-side (feedback)
- Nunca expor secrets em frontend

---

## 8. Checklist de Code Review

Antes de fazer PR:

- [ ] **Nomes**: Variáveis, funções, classes seguem convenção
- [ ] **Camadas**: Controller → Service → Repository (Backend)
- [ ] **DTOs**: Separados por operação (Create, Update, Response)
- [ ] **Validação**: DTO + Service + Frontend 2-layer
- [ ] **Exceções**: Custom exceptions com codigo+status
- [ ] **Logging**: @Slf4j, sem senhas/tokens
- [ ] **Testes**: Cobertura ≥ 80%, nome descritivo
- [ ] **Segurança**: Sem SQL injection, XSS, senhas plain
- [ ] **Performance**: Índices BD, lazy loading, cache
- [ ] **Doc**: JavaDoc/JSDoc em funções públicas, README atualizado
- [ ] **Git**: Commit message clara, sem merge conflicts
- [ ] **Arquitetura**: Sem acoplamento, SOLID principles

---

## 9. Template de Arquivo

### 9.1 Entity

```java
@Entity
@Table(name = "aluno")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlunoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aluno_id")
    private Long id;

    @Column(name = "nome_completo", nullable = false, length = 255)
    private String nomeCompleto;

    @Column(name = "cpf", unique = true, nullable = false, length = 11)
    private String cpf;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MatriculaEntity> matriculas = new ArrayList<>();

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }
}
```

### 9.2 DTO

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlunoCreateDto {
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 255, message = "Nome deve ter entre 3 e 255 caracteres")
    private String nomeCompleto;

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "^\\d{11}$", message = "CPF deve ter 11 dígitos")
    private String cpf;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "Data deve ser no passado")
    private LocalDate dataNascimento;
}
```

---

**Última atualização**: 2 de abril de 2026  
**Owner**: Tech Lead  
**Aplicação**: OBRIGATÓRIO em todas PRs via SonarQube + Code Review

