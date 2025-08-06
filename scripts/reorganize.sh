#!/bin/bash

echo "🚀 Reorganizando estrutura do repositório GTM Templates..."

# Criar nova estrutura de pastas
echo "📁 Criando nova estrutura de pastas..."
mkdir -p client/tags
mkdir -p client/variables
mkdir -p server/tags
mkdir -p server/variables
mkdir -p docs
mkdir -p scripts

# Mover tags ClientSide
echo "📦 Movendo tags client-side..."
if [ -d "tags/ClientSide/behiivee-iframe-tracker" ]; then
    mv "tags/ClientSide/behiivee-iframe-tracker" "client/tags/"
fi
if [ -d "tags/ClientSide/dedup-transaction-id" ]; then
    mv "tags/ClientSide/dedup-transaction-id" "client/tags/"
fi
if [ -d "tags/ClientSide/ga4-identity-hub" ]; then
    mv "tags/ClientSide/ga4-identity-hub" "client/tags/"
fi
if [ -d "tags/ClientSide/iframe-tracker" ]; then
    mv "tags/ClientSide/iframe-tracker" "client/tags/"
fi
if [ -d "tags/ClientSide/panda-video" ]; then
    mv "tags/ClientSide/panda-video" "client/tags/"
fi

# Mover tags ServerSide
echo "📦 Movendo tags server-side..."
if [ -f "tags/ServerSide/RD Station Conversion API KEY.tpl" ]; then
    mkdir -p "server/tags/rd-station-conversion-api"
    mv "tags/ServerSide/RD Station Conversion API KEY.tpl" "server/tags/rd-station-conversion-api/template.tpl"
fi

# Mover variables ServerSide
echo "📦 Movendo variables server-side..."
if [ -f "variables/ServerSide/FPID Cleaner.tpl" ]; then
    mkdir -p "server/variables/fpid-cleaner"
    mv "variables/ServerSide/FPID Cleaner.tpl" "server/variables/fpid-cleaner/template.tpl"
fi
if [ -f "variables/ServerSide/Get LocalStorage Key Value.tpl" ]; then
    mkdir -p "server/variables/get-localstorage-value"
    mv "variables/ServerSide/Get LocalStorage Key Value.tpl" "server/variables/get-localstorage-value/template.tpl"
fi

# Mover variables ClientSide
echo "📦 Movendo variables client-side..."
if [ -d "variables/get-orderform-vtexio-data" ]; then
    mv "variables/get-orderform-vtexio-data" "client/variables/"
fi

# Remover estrutura antiga vazia
echo "🗑️  Removendo estrutura antiga..."
if [ -d "tags/ClientSide" ] && [ -z "$(ls -A tags/ClientSide)" ]; then
    rmdir "tags/ClientSide"
fi
if [ -d "tags/ServerSide" ] && [ -z "$(ls -A tags/ServerSide)" ]; then
    rmdir "tags/ServerSide"
fi
if [ -d "tags" ] && [ -z "$(ls -A tags)" ]; then
    rmdir "tags"
fi
if [ -d "variables/ServerSide" ] && [ -z "$(ls -A variables/ServerSide)" ]; then
    rmdir "variables/ServerSide"
fi
if [ -d "variables/ClientSide" ] && [ -z "$(ls -A variables/ClientSide)" ]; then
    rmdir "variables/ClientSide"
fi
if [ -d "variables" ] && [ -z "$(ls -A variables)" ]; then
    rmdir "variables"
fi

# Mover CLAUDE.md para docs se existir
if [ -f "CLAUDE.md" ]; then
    mv "CLAUDE.md" "docs/"
fi

echo "✅ Reorganização concluída!"
echo ""
echo "Nova estrutura:"
echo "├── client/"
echo "│   ├── tags/"
echo "│   └── variables/"
echo "├── server/"
echo "│   ├── tags/"
echo "│   └── variables/"
echo "├── docs/"
echo "└── scripts/"