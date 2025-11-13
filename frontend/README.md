# Explorador de Algoritmos (Algorithm Explorer)

Projeto acadêmico desenvolvido para as disciplinas de **Análise de Algoritmos**, **Algoritmos em Grafos** e **Computação em Nuvem**. A aplicação consiste em uma plataforma web para criação, visualização e análise de algoritmos clássicos, incluindo algoritmos de ordenação e operações em grafos.

## 📖 Descrição

O Algorithm Explorer é uma ferramenta interativa que permite ao usuário:

- **Explorar Algoritmos de Ordenação:** Inserir um conjunto de dados e visualizar o funcionamento de algoritmos de ordenação avançados (como Merge Sort, Quick Sort, etc.), analisando seu desempenho.
- **Manipular Grafos:** Desenhar grafos de forma interativa, adicionando nós e arestas. Uma vez que o grafo é criado, o usuário pode selecionar um algoritmo (como Busca em Largura, Dijkstra, etc.), executá-lo e visualizar o resultado passo a passo diretamente na interface gráfica.

A arquitetura é baseada em microserviços, com um frontend desacoplado do backend, e toda a infraestrutura é hospedada na nuvem da Microsoft Azure.

## 🛠️ Arquitetura e Tecnologias

A solução é composta por:

- **Frontend:**

  - **Framework:** Vue.js
  - **Visualização:** Cytoscape.js
  - **Componentes de UI:** PrimeVue
  - **Gerenciamento de Estado:** Pinia
  - **Hospedagem:** Azure Static Web Apps

- **Backend:**

  - **Linguagem:** Java 21
  - **Framework:** Spring Boot 3
  - **Biblioteca de Grafos:** JGraphT
  - **Hospedagem:** Azure App Service

- **Cloud Provider:**
  - Microsoft Azure

## ⚙️ Como Executar (Planejado)

1.  **Backend (API):**

    - Clonar o repositório.
    - Navegar para a pasta do backend.
    - Executar `mvn spring-boot:run`.
    - A API estará disponível em `http://localhost:8080`.

2.  **Frontend (UI):**
    - Navegar para a pasta do frontend.
    - Executar `npm install` para instalar as dependências.
    - Executar `npm run dev` para iniciar o servidor de desenvolvimento.
    - Acessar a aplicação em `http://localhost:5173`.

## 👥 Autor

- Rodrigo Marcos Nogueira Pestana
