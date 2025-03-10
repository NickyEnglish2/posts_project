install:
				npm ci

front:
				npm run dev

build:
				npm run build

preview:
				npm run preview

server:
				npx json-server data/db.json

start:
				make server & make front

test:
				npm run test