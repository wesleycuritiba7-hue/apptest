# 📱 METAS APP — Expo + EAS Build

App de tracker de metas pessoais feito com **Expo SDK 50**.

---

## 🗂️ ESTRUTURA

```
MetasApp/
├── App.tsx                        ← Entrada + navegação (3 abas)
├── app.json                       ← Config do Expo
├── eas.json                       ← Config do EAS Build (gera APK)
├── package.json
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx         ← Dashboard geral
│   │   ├── PeriodScreen.tsx       ← Metas por período + check
│   │   └── StatsScreen.tsx        ← Progresso detalhado
│   └── utils/
│       └── storage.ts             ← AsyncStorage (dados no celular)
└── assets/                        ← Ícones e splash (adicione as imagens)
```

---

## 🚀 GERAR APK PELO EAS BUILD (Recomendado)

### 1. Suba o projeto no GitHub
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/SEU_USUARIO/metas-app.git
git push -u origin main
```

### 2. Crie conta em https://expo.dev (gratuito)

### 3. Instale o EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 4. Configure o projeto
```bash
eas build:configure
```

### 5. Gere o APK
```bash
# APK para instalar diretamente (não precisa de Google Play)
eas build --platform android --profile preview
```

Aguarde ~5 minutos. O link para download do APK aparece no terminal e em https://expo.dev.

---

## 🔧 RODAR LOCALMENTE (para testar antes)

```bash
npm install
npx expo start
```
Escaneie o QR Code com o app **Expo Go** no celular.

---

## 🖼️ ÍCONES (necessário para build)

Coloque na pasta `assets/`:
- `icon.png` — 1024×1024px (ícone do app)
- `splash.png` — 1284×2778px (tela de carregamento)  
- `adaptive-icon.png` — 1024×1024px (ícone adaptativo Android)

Pode usar qualquer imagem PNG por enquanto para o build funcionar.

---

## ✨ FUNCIONALIDADES

- ✅ Dashboard com stats gerais (total / concluídas / pendentes)
- ✅ Barra de progresso geral
- ✅ 5 períodos: Diária · Semanal · Mensal · Semestral · Anual
- ✅ Adicionar metas com Enter ou botão
- ✅ Check para concluir / desconcluir
- ✅ Deletar com confirmação
- ✅ Progresso por período com visual detalhado
- ✅ Mensagem motivacional dinâmica
- ✅ Dados salvos no celular (AsyncStorage)
- ✅ Tema escuro

---

## ❓ PROBLEMAS COMUNS

**Erro: "assets not found"**
→ Adicione imagens PNG na pasta `assets/` conforme acima.

**Erro de autenticação no EAS**
→ Rode `eas login` novamente.

**Build falhou no EAS**
→ Veja os logs em https://expo.dev/accounts/[seu-usuario]/projects/metas-app/builds
