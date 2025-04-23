# mcp-mysql-proxy

`mcp-mysql-proxy` is a high-performance MCP (Model Context Protocol) server for MySQL, written in TypeScript. It allows AI tools like Cursor, Claude, OpenAI Codex, and others to safely access and query MySQL databases.

---

## Features

- ✅ Secure access to MySQL databases via MCP
- ✅ Supports SELECT, INSERT, UPDATE, DELETE (permissions configurable)
- ✅ Query execution metrics (duration, row count)
- ✅ Fully typed and production-ready (TypeScript + Node.js)
- ✅ Zero-config support via `npx`
- ✅ Integration-ready with Cursor IDE, Claude Desktop, Codex, Visual Studio Code (experimental)

---

## Requirements

- Node.js v18+
- MySQL 5.7+ (8.0+ recommended)
- pnpm (recommended) or npm

---

## Installation

```bash
# Clone the repository
git clone git@github.com:osvfelices/mcp-mysql-proxy.git
cd mcp-mysql-proxy

# Install dependencies
pnpm install

# Build the project
pnpm run build
```

---

## Usage with `npx`

```bash
npx -y mcp-mysql-proxy
```

To use custom environment settings, create a `.env` file or pass variables inline.

---

## .env Configuration

```env
# ┌──────────────────────────────┐
# │      MySQL Connection        │
# └──────────────────────────────┘
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASS=your_password
MYSQL_DB=your_database # optional, leave empty for multi-DB mode

# ┌──────────────────────────────┐
# │    Allowed SQL Operations    │
# └──────────────────────────────┘
ALLOW_INSERT_OPERATION=false
ALLOW_UPDATE_OPERATION=false
ALLOW_DELETE_OPERATION=false

# ┌──────────────────────────────┐
# │        Server Settings       │
# └──────────────────────────────┘
PORT=3000
NODE_ENV=development
```

---

## Integration

### Cursor IDE

```json
{
  "mcpServers": {
    "MySQLProxy": {
      "command": "npx",
      "args": ["-y", "mcp-mysql-proxy"],
      "env": {
        "MYSQL_HOST": "127.0.0.1",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASS": "your_password",
        "MYSQL_DB": "your_database",
        "ALLOW_INSERT_OPERATION": "false",
        "ALLOW_UPDATE_OPERATION": "false",
        "ALLOW_DELETE_OPERATION": "false"
      }
    }
  }
}
```

### Claude Desktop

Edit your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "MySQLProxy": {
      "command": "npx",
      "args": ["-y", "mcp-mysql-proxy"],
      "env": {
        "MYSQL_HOST": "127.0.0.1",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASS": "your_password",
        "MYSQL_DB": "your_database",
        "ALLOW_INSERT_OPERATION": "false",
        "ALLOW_UPDATE_OPERATION": "false",
        "ALLOW_DELETE_OPERATION": "false"
      }
    }
  }
}
```

---

## License

MIT
