# Sistema de Reservas - ETEC (Centro Paula Souza)

Este projeto foi desenvolvido como parte das atividades acadêmicas do 2º semestre na **ETEC (Centro Paula Souza)**. Trata-se de um sistema web completo para o gerenciamento e controle de reservas de materiais e equipamentos da entidade.

## 🎯 Objetivo

O objetivo principal da aplicação é facilitar a organização interna, permitindo que professores e funcionários reservem materiais e kits pedagógicos, além de fornecer ferramentas administrativas para o controle de estoque e de usuários do sistema.

## ⚙️ Funcionalidades

O sistema possui controle de acesso baseado em três níveis de permissão, cada um com capacidades específicas:

### 1. 👨‍🏫 Professor
* **Reservas:** Pode realizar reservas de laboratórios atrelando um kit .
* **Kits:** Pode criar kits personalizados de materiais para uso em suas aulas (kits privados).

### 2. 🛠️ Técnico
Possui permissões elevadas para auxiliar na gestão do dia a dia:
* **Gestão de Estoque:** Pode modificar a quantidade de materiais disponíveis.
* **Kits:** Criação de kits globais (kits públicos disponíveis para todos).
* **Gestão de Usuários (Parcial):** Pode cadastrar novos usuários, porém **apenas** com o nível de acesso "Professor".
* **Reservas:** Acesso completo às reserva feitas no sitema e o tabém o histórico.

### 3. 🛡️ Administrador (ADM)
Acesso total ao sistema (Superusuário):
* **Gestão Completa de Usuários:** Pode criar, editar e remover usuários de qualquer nível (Professor, Técnico ou ADM).
* **Gestão de Estoque e Kits:** Controle total sobre materiais e kits globais.
* **Reservas:** Acesso completo às reserva feitas no sitema e o tabém o histórico.

## 🚀 Tecnologias Utilizadas

O projeto foi estruturado separando o Front-end e o Back-end:

### Front-end (Pasta `/front`)
* **HTML5** & **CSS3**: Estrutura e estilização.
* **Bootstrap**: Framework para layout responsivo e componentes visuais.
* **JavaScript**: Lógica de interação no navegador.

### Back-end (Pasta `/back`)
* **TypeScript**: Superset do JavaScript para maior segurança e tipagem no servidor.
* **MongoDB**: Banco de dados NoSQL utilizado para persistência dos dados (usuários, reservas, materiais).

## 📦 Como rodar o projeto

### Pré-requisitos
* [Node.js](https://nodejs.org/) instalado.

### Passo 1: Configuração do Back-end

1.  Clone o Repositório:
    ```bash
    git clone https://github.com/GuiGuerreiroo/PI_etec_2sem
    ```
1.  Acesse a pasta do servidor:
    ```bash
    cd PI_etec_2sem
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure as variáveis de ambiente ( `.env`, configure a URL do MongoDB).
4.  Inicie o servidor:
    ```bash
    npm run dev
    ```

### Passo 2: Configuração do Front-end

1.  Como o front é feito com HTML/JS estático (baseado na descrição), você pode simplesmente abrir o arquivo `login.html` no seu navegador ou utilizar uma extensão como o **Live Server** do VS Code para rodar a aplicação.


### Partcipante do Desenvolvimento do Projeto

 - Guilherme Guerreiro

 - João Guima

 - Enzo Toro 

 - Diego Alonso 

 - Gabriel Bocato


## 📝 Licença

Este projeto é desenvolvido para fins educacionais sob a orientação do Centro Paula Souza.
