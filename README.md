# 🔧 AutoService Finder

O **AutoService Finder** é uma aplicação web interativa projetada para ajudar motoristas a localizarem serviços automotivos essenciais (oficinas mecânicas, lava-rápidos e postos de combustível) em tempo real. O sistema utiliza a geolocalização do usuário ou permite a busca manual por cidades, bairros ou endereços.

Este projeto foi desenvolvido seguindo as **diretrizes modernas de segurança da OWASP** contra vulnerabilidades web e utiliza a infraestrutura oficial da Google Maps API.

---

## 🚀 Funcionalidades

*   **Geolocalização Automática:** Identifica a posição atual do usuário (com consentimento) para exibir serviços em um raio de 2km.
*   **Busca Global Inteligente:** Permite digitar qualquer endereço, avenida ou cidade para mover o mapa e buscar serviços no novo local.
*   **Filtro Automotivo:** Busca integrada para três categorias:
    *   Oficinas Mecânicas (`car_repair`)
    *   Lava-Rápidos (`car_wash`)
    *   Postos de Gasolina (`gas_station`)
*   **Marcadores Avançados (Seguros):** Uso de `AdvancedMarkerElement` com InfoWindows imunes a injeção de código (XSS).
*   **Painel Lateral de Resultados:** Lista os estabelecimentos com nome, endereço, nota de avaliação (estrelas) e botão de foco rápido.

---

## 🔒 Diretrizes de Segurança Implementadas

Para garantir a integridade da aplicação e evitar fraudes ou ataques, o código foi blindado com as seguintes práticas:

1.  **Proteção contra Cross-Site Scripting (XSS):** Nenhuma informação vinda da API externa é injetada via `innerHTML`. Toda a estrutura de cartões e balões do mapa é gerada nativamente pelo DOM (`document.createElement` e `textContent`), neutralizando scripts maliciosos injetados por terceiros em nomes de estabelecimentos.
2.  **Mitigação de Eventos Inline:** Manipuladores de clique antigos (`onclick="..."`) foram removidos do HTML e substituídos por escutadores de eventos (`addEventListener`) controlados por escopo em JavaScript.
3.  **Modernização de Componentes:** Substituição da classe legada e depreciada `google.maps.Marker` pelos novos componentes encapsulados da Google.

---

## 🛠️ Pré-requisitos e APIs Necessárias

Para que o projeto funcione localmente ou em produção, você precisará de uma **Chave de API (API Key)** do Google Cloud Platform com as seguintes APIs obrigatoriamente ativadas:

*   **Maps JavaScript API** (Renderização do mapa e marcadores)
*   **Places API** (Busca dos serviços automotivos ao redor)
*   **Geocoding API** (Conversão de texto de busca em coordenadas geográficas)

---

## ⚙️ Configuração e Instalação

1. Clone ou baixe os arquivos do projeto em uma pasta:
   * `index.html`
   * `app.js`
   * `styles.css`

2. Abra o arquivo `index.html` e localize a linha que carrega o script do Google Maps (próxima ao final do arquivo):
```html
   <script async defer
       src="[https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_API&libraries=places,marker&callback=initMap](https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_API&libraries=places,marker&callback=initMap)">
   </script>

```

3. Substitua `SUA_CHAVE_API` pela sua chave gerada no painel do Google.
4. Abra o arquivo `index.html` em qualquer navegador ou utilize extensões como o *Live Server* do VS Code.

---

## 🚨 Hardening: Como Proteger sua Chave de API em Produção

Como esta é uma aplicação puramente front-end, a sua chave de API fica visível no código-fonte. **Para evitar que outras pessoas usem sua chave e gerem cobranças na sua conta**, configure as restrições no Console do Google Cloud:

1. Acesse **APIs e Serviços > Credenciais** no Google Cloud.
2. Edite a chave de API do projeto.
3. Em **Restrições de aplicativos**, selecione **Websites (referenciadores HTTP)**.
4. Adicione a URL do seu site (Ex: `https://meuprojeto.com/*` ou `http://localhost/*` para testes).
5. Em **Restrições de API**, selecione "Restringir chave" e marque apenas as 3 APIs utilizadas (*Maps JavaScript*, *Places* e *Geocoding*).
6. Salve as alterações (pode levar até 5 minutos para propagar na nuvem do Google).

---

## 📝 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.

```
