CREATE SCHEMA IF NOT EXISTS fortes;
USE fortes;

create table if not exists colaborador(
id_colab int not null primary key,
nome_colab varchar(50),
email varchar(50),
senha varchar(255)
);

create table if not exists obra(
id_obra int primary key auto_increment,
endereco varchar(150)
);

create table if not exists pedido(
id_pedido int primary key auto_increment,
fk_id_colab int,
fk_id_obra int,
data_refeicao datetime,
data_requisicao date,
refeicao enum('Café da manhã','Almoço', 'Jantar'),
constraint pedido_obra foreign key (fk_id_obra) references obra(id_obra),
constraint pedido_colab foreign key (fk_id_colab) references colaborador(id_colab)
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
flush privileges;

INSERT INTO obra VALUES (1, "Ed. Eleganza Residence");