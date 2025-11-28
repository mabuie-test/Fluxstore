# Fluxstore Marketplace Blueprint

Este repositório contém uma espinha dorsal para a Fluxstore com foco em pagamentos Mpesa, marketplace multi-vendedor e fluxos de disputa/entrega. O diretório `Mpesa_samples` mantém os exemplos originais de integração, enquanto `backend/` traz uma API Node.js pronta para expansão.

## Backend (Node.js + MongoDB)
- **Autenticação**: registro/login por email com verificação via token, recuperação de senha e login social (Google/Facebook placeholders) + reset seguro de senha.
- **Marketplace**: CRUD de produtos com variantes, badges, SEO e templates de envio, inventário por variante, carrinho persistido e pedidos com cálculo de ETA por região e rastreamento de status de envio.
- **Pagamentos Mpesa**: simulação de C2B para cobrança e B2C para saque de vendedores, com divisão de receita (plataforma, vendedor, retenção de disputa).
- **Disputas e Reembolsos**: abertura e resolução de disputa com opção de reembolso e atrasos na liberação de saldo para vendedores.
- **Payouts**: endpoint para liberar saldos retidos após confirmação de entrega ou resolução de disputa.
- **Promoções/monetização**: cupons administráveis, pontos de fidelidade, descontos dinâmicos e escrow de Mpesa antes do repasse ao vendedor.
- **Reviews sociais**: avaliações verificadas de compradores, atualização automática de rating e métricas de engajamento do produto.
- **Estética/landing**: endpoint `/api/marketing/storefront` retorna herói, cores, vitrines, blocos de confiança e guia de estilo com tipografia, sombras e presets de layout para montar a "carinha" da loja. O `/api/marketing/lookbook` entrega moodboards com paletas, presets e seções editoriais.
- **Wishlist & moodboard**: `/api/wishlist` salva achados com tags, notas, prioridades e um texto de moodboard customizável.
- **Newsletter & anúncios**: `/api/marketing/newsletter` para opt-in e `/api/marketing/newsletter/broadcast` para disparar campanhas periódicas com anúncios de novidades e ofertas.
- **Admin UX sem código**: `/api/admin/menu` entrega menus completos para compradores, vendedores e admins; `/api/admin/settings` permite editar cores, blocos da home, taxas, presets de layout/estilo e feature flags sem alterar código; `/api/admin/dashboard` resume GMV, risco e base de usuários.
- **Denúncias/moderação**: `/api/reports` abre denúncias de produtos/pedidos/usuários; admins podem listar e resolver.
- **Notificações e auditoria**: `/api/notifications` lista, marca como lidas e permite broadcast segmentado; `/api/audit` oferece trilha de auditoria para admins consultarem ações críticas (pagamentos, disputas, denúncias).

### Como executar
1. Configure variáveis de ambiente em `.env` (MongoDB, credenciais Mpesa e SMTP). Valores de sandbox estão definidos como padrão em `backend/src/config/env.js`.
2. Instale dependências na pasta `backend/`:
   ```bash
   npm install
   npm run dev
   ```
3. Endpoints principais:
   - `POST /api/auth/register` | `POST /api/auth/login` | `POST /api/auth/social`
   - `POST /api/auth/password/request` | `POST /api/auth/password/reset` | `GET /api/auth/verify`
   - `GET /api/products` | `POST /api/products`
   - `GET /api/cart` | `POST /api/cart/items` | `PATCH /api/cart/items/:id`
   - `POST /api/orders` | `GET /api/orders`
   - `POST /api/disputes/:id` | `POST /api/disputes/:id/resolve`
   - `POST /api/payouts/:id/release`
   - `POST /api/promotions` (admin) | `GET /api/promotions`
   - `POST /api/reviews` | `GET /api/reviews/:productId`
    - `GET /api/marketing/storefront` | `GET /api/marketing/lookbook`
    - `POST /api/marketing/newsletter` | `POST /api/marketing/newsletter/broadcast`
    - `GET /api/wishlist` | `POST /api/wishlist/items` | `PATCH /api/wishlist/items/:id`
    - `PATCH /api/auth/preferences`
    - `GET /api/admin/menu` | `GET /api/admin/dashboard` | `PATCH /api/admin/users/:id/status`
    - `GET /api/admin/settings` | `PATCH /api/admin/settings`
    - `POST /api/reports` | `GET /api/reports` (admin) | `PATCH /api/reports/:id` (admin)
    - `GET /api/notifications` | `PATCH /api/notifications/:id/read` | `POST /api/notifications/broadcast` (admin)
    - `GET /api/audit` (admin)

Substitua os placeholders (`buyer-msisdn`, `seller-msisdn`, URLs e tokens sociais) conforme integrar com provedores reais. A camada de serviços foi escrita para ser facilmente trocada por SDKs oficiais ou chamadas REST completas.

### Deploy
- Para uma configuração rápida no Render, siga o guia detalhado em `redme.txt`, incluindo variáveis de ambiente, comandos de build/start e recomendações de boas práticas.
- Um arquivo de exemplo `.env.example` em `backend/` lista todas as variáveis utilizadas pelo backend.

## Frontend (React + Vite)
- **Stack**: React 18, Vite, React Router, Zustand e Axios. O build gerado em `frontend/dist` é servido automaticamente pelo Express em produção quando a pasta existe.
- **Tela pública**: landing editorial com hero, lookbook, guia de estilo, newsletter e vitrine curada conectada ao `/api/marketing` e `/api/products`.
- **Checkout completo**: carrinho persistido, fidelidade, estimativa de entrega e checkout Mpesa via `/api/cart` e `/api/orders`.
- **Conta**: registro/login, login social (placeholders Google/Facebook), verificação por email, recuperação de senha, preferências regionais, newsletter e wishlist/notificações sincronizadas.
- **Admin console**: dashboards em tempo real, menu dinâmico por role, atualização de settings (branding, taxas), fila de denúncias e broadcast de notificações.

### Como executar o frontend
1. Instale dependências na pasta `frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Para build de produção (consumido pelo Express):
   ```bash
   npm run build
   cd ../backend && npm run dev
   ```
