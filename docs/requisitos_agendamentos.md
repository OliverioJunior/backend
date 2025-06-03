# Requisitos do Sistema - Gestão de Agendamentos

---

## **Requisitos Funcionais**

### **RQF7 - Inserir Agendamento**  
- **Campos obrigatórios:**  
  - Data do agendamento (data e hora).  
  - Professor selecionado.  
  - Estudante selecionado.  
  - Conteúdo da aula.  
- **Regras:**  
  - Data/hora deve respeitar disponibilidade do professor.  
  - Professor não pode ter mais de **2 aulas no mesmo dia** (alerta se exceder).  
  - Agendamento não pode ser feito com menos de **24 horas de antecedência**.  
  - Para estudantes **menores de 16 anos**:  
    - Emitir alerta e gerar PDF para assinatura manual do responsável.  
    - PDF deve conter dados do estudante e da aula (layout definido pelo candidato).  

### **RQF8 - Editar Agendamento**  
- **Campos editáveis:**  
  - Data do agendamento.  
  - Professor.  
  - Estudante.  
  - Conteúdo da aula.  
- **Restrições:**  
  - Mesmas regras de cadastro (RQF7).  
  - Edição permitida apenas até **24 horas antes da aula**.  

### **RQF9 - Gestão de Agendamentos do Estudante**  
- **Listagem:**  
  - Todos os agendamentos do estudante.  
  - Exibir data/hora da aula e link do WhatsApp.  
  - **Ações:**  
    - Alterar agendamento (modal de edição).  
    - Cancelar agendamento (confirmação prévia).  

---

## **Requisitos Não Funcionais**  
- **RQNF1:** Banco de dados PostgreSQL.  
- **RQNF3:** 30% de cobertura de testes unitários nas classes de regra de negócio.  
- **RQNF4:** Acesso ao backend restrito (não público).  
- **RQNF5:** Retorno HTTP conforme padrão REST (ex: 200 OK, 400 Bad Request).  
- **RQNF6:** Frontend deve tratar erros retornados pelo backend.  
- **RQNF7:** Migrations para estrutura do banco.  

---

## **Telas (Protótipos)**  
- **PROTÓTIPO 6:** Tela de listagem e agendamento de aulas.  
  - Seleção de professor, estudante, data/hora e conteúdo.  

---

## **Documentação e Envio**  
- **Readme:** Incluir instruções de configuração (Docker, dependências).  
- **Envio:** Arquivo único em PDF com:  
  - Documento preenchido (dados do candidato e link do GitHub).  
  - RG/CNH e comprovante de escolaridade.  

---

## **Observações Importantes**  
- **Validações críticas:**  
  - Conflitos de horário de professores.  
  - Tratamento de erros de backend no frontend.  
  - Geração de PDF para menores de idade.  
- **Critérios de avaliação:**  
  - Organização do projeto.  
  - Reutilização de código.  
  - Qualidade dos testes unitários.  


# Requisitos e Funcionalidades para a Entidade "Agendamento"

---

## 1. Campos Obrigatórios  
- **Data e Hora do Agendamento** (campo obrigatório).  
- **Professor** (campo obrigatório, vinculado à entidade Professor via CPF).  
- **Estudante** (campo obrigatório, vinculado à entidade Estudante via CPF).  
- **Conteúdo da Aula** (campo obrigatório, texto livre).  

---

## 2. Regras de Negócio  
- **Validação de Conflito de Horário**:  
  - Um professor não pode ter mais de duas aulas agendadas no mesmo dia.  
  - Em caso de conflito, retornar erro HTTP `409 Conflict`.  

- **Limite de Antecedência**:  
  - Agendamentos devem ser feitos com **no mínimo 24 horas de antecedência**.  
  - Tentativas fora do prazo retornam erro HTTP `400 Bad Request`.  

- **Restrição de Edição**:  
  - Alterações só são permitidas até **24 horas antes da aula**.  
  - Após o prazo, retornar erro HTTP `403 Forbidden`.  

- **Estudantes Menores de 16 Anos**:  
  - Gerar PDF com dados do estudante e aula, exigindo assinatura do responsável.  
  - PDF deve ser salvo no banco de dados (campo opcional) e permitir impressão.  

- **Status do Agendamento**:  
  - Valores suportados: `Agendado`, `Cancelado`, `Concluído`.  

---

## 3. Relacionamentos com Outras Entidades  
- **Professor**:  
  - Relacionamento via CPF (chave estrangeira).  
  - Listar apenas professores com status **ativo** durante o agendamento.  

- **Estudante**:  
  - Relacionamento via CPF (chave estrangeira).  
  - Verificar idade do estudante para aplicar regra do PDF.  

---

## 4. Requisitos Técnicos  

### Banco de Dados  
- **SGBD**: PostgreSQL.  
- **Migrations**: Criar estrutura da tabela `agendamentos`:  
  ```sql
  CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    data_hora TIMESTAMP NOT NULL,
    professor_id VARCHAR(11) REFERENCES professores(cpf),
    estudante_id VARCHAR(11) REFERENCES estudantes(cpf),
    conteudo_aula TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Agendado',
    pdf_assinatura BYTEA -- ou caminho do arquivo
  );