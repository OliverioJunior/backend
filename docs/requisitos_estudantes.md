# Requisitos do Sistema - Gestão de Estudantes

---

## **Requisitos Funcionais**

### **RQF4 - Modal de Cadastro de Estudante**  
- **Campos obrigatórios:**  
  - CPF (único, bloqueia cadastro se já existir).  
  - Nome e sobrenome.  
  - Data de Nascimento.  
  - Endereço domiciliar:  
    - CEP (preenche automaticamente logradouro, bairro, estado, cidade).  
    - Logradouro.  
    - Número da casa (permite "SN" se não houver número).  
    - Bairro.  
    - Estado.  
    - Cidade (lista cidades conforme estado selecionado).  
  - Contatos:  
    - Telefone/Celular.  
    - WhatsApp (obrigatório).  
    - E-mail.  

### **RQF5 - Modal de Edição de Estudante**  
- Campos editáveis: Todos, exceto CPF (imutável após cadastro).  
- Validações e persistência de dados semelhantes ao cadastro.  

### **RQF6 - Gestão de Estudantes**  
- **Listagem:**  
  - Tabela em ordem alfabética.  
  - WhatsApp renderizado como link direto (ex: `https://api.whatsapp.com/send/?phone=55xxxxxxxxx`).  
  - **Ações:**  
    - Editar (redireciona para tela de edição).  
    - Excluir (confirmação prévia).  
    - Realizar agendamento (redireciona para listagem de agendamentos).  

---

## **Requisitos Não Funcionais**  
- **RQNF1:** Banco de dados PostgreSQL.  
- **RQNF3:** 30% de cobertura de testes unitários nas classes de regra de negócio.  
- **RQNF7:** Estrutura do banco criada via *migrations*.  
- **RQNF8:** Campos obrigatórios marcados com asterisco (\*).  

---

## **Regras para Agendamentos**  
- **Estudantes menores de 16 anos:**  
  - Sistema emite alerta e gera PDF para assinatura manual de responsável.  
  - PDF deve conter dados do estudante e da aula (layout definido pelo candidato).  

---

## **Telas (Protótipos)**  
- **PROTÓTIPO 2 e 3:** Gestão de estudantes (listagem e modal de cadastro/edição).  
- **PROTÓTIPO 6:** Tela de agendamentos (vinculação a estudantes e professores).  

---

## **Documentação e Envio**  
- **Readme:** Detalhar configuração do projeto (Docker, dependências, execução).  
- **Envio:** Arquivo único em PDF contendo:  
  - Documento preenchido (nome, e-mail, CPF, link do GitHub).  
  - RG/CNH válida com foto.  
  - Comprovante de escolaridade.  

---

## **Observações Importantes**  
- Validações críticas:  
  - Bloqueio de CPF duplicado.  
  - Integração com API de CEP.  
  - Tratamento de erros do backend no frontend.  
- **Prazo final:** Envio até 11/05/2025 às 23h59 via Sistema Pandapé.  
