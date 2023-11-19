Requisitos para iniciar o WebApp:

- Node.JS instalado na máquina
- MYSQL Server instalado na máquina (Com usuario "root" tendo a senha "123456")
- MYSQL Workbench instalado na máquina



Passo a passo para iniciar o WebApp:

1 - Abra o MYSQL Workbench, conecte-se ao banco e execute o código presente em "BD - FORTES.sql", que deve gerar o banco de dados e adicionar uma obra ao mesmo, 
além de ajustar as permissões do banco para que seja possível para o site conecte-se a ele.

2 - Abra o diretório "WebApp - Site" com o Visual Studio Code e garanta que o Node.JS esteja instalado.

3 - Abra um novo terminal (através do menu superior "Terminal" ou com o atalho "Ctrl + Shift + '" e digite "node server.js"

4 - Entre no navegador e abra a página "localhost:8080"

5 - Tudo pronto, o WebApp deve funcionar normalmente!