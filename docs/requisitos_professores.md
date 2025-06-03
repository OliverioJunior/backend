# Requisitos do Sistema - Gestão de Professores

---

## **Requisitos Funcionais**

### **RQF2 - Modal de Cadastro de Professor**  
- **Campos obrigatórios:**  
  - [x] CPF (único, não editável após cadastro).   
  - [x] Nome e sobrenome.  
  - [x] Data de nascimento.  
  - [x] Status (ativo/inativo).  
- **Campo opcional:**  
  - [x] Especialidade (áreas de atuação).  
- **Validações:**  
  - [x] Garantir preenchimento correto de campos obrigatórios.  
  - [ ] Mensagem de sucesso após persistência dos dados.  

### **RQF3 - Gestão de Professores**  
- **Listagem:**  
  - Tabela com dados:  
    - [ ] Nome e sobrenome.  
    - [ ] Especialidade (se disponível).  
    - [ ] Status (ativo/inativo).  
  - **Ações:**  
    - [ ] Editar (redireciona para tela de edição).  
    - [ ] Excluir (confirmação prévia).  
  - **Funcionalidades:**  
    - [ ] Ordenação por colunas.  
    - [ ] Pesquisa por CPF ou nome.  

---

## **Requisitos Não Funcionais**  
- [ ] **RQNF1:** Banco de dados PostgreSQL.  
- [ ] **RQNF3:** 30% de cobertura de testes unitários nas classes de regra de negócio.  
- [ ] **RQNF7:** Estrutura do banco criada via *migrations*.  
- [ ] **RQNF8:** Campos obrigatórios marcados com asterisco (\*).  

---

## **Regras Específicas em Agendamentos (RQF7 e RQF8)**  
- **Restrições para professores:**  
  - [ ] Um professor não pode ter mais de **2 aulas agendadas no mesmo dia**.  
  - [ ] Em caso de conflito de horário, exibir mensagem de erro.  
  - [ ] Edição de agendamento só é permitida até **24 horas antes da aula**.  

---

## **Telas (Protótipos)**  
- [ ] **PROTÓTIPO 4:** Listagem de professores com ações de inserir, editar e excluir.  
- [ ] **PROTÓTIPO 5:** Modal de cadastro/edição de professores.  

---

## **Documentação e Envio**  
- [ ] **Readme:** Detalhar configuração do projeto (Docker, dependências, execução).  
- **Envio:** Arquivo único em PDF contendo:  
  - [ ] Documento preenchido (nome, e-mail, CPF, link do GitHub).  
  - [ ] RG/CNH válida com foto.  
  - [ ] Comprovante de escolaridade.  

---

## **Observações Importantes**  
- **Validações críticas:**  
  - [ ] Bloqueio de CPF duplicado.  
  - [ ] Integração com backend para restrições de agendamento.  
  - [ ] Tratamento de erros do backend no frontend.  
- **Prazo final:** Envio até 11/05/2025 às 23h59 via Sistema Pandapé.  
- **Critérios de avaliação:**  
  - [ ] Complexidade ciclomática do código.  
  - [ ] Divisão de responsabilidades entre classes.  
  - [ ] Qualidade dos testes unitários.
