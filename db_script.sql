create database simpleapi_db;
use simpleapi_db;

create table usuarios(
	id int not null primary key auto_increment,
    nome varchar(90) not null,
    email varchar(90) not null,
    senha varchar(255) not null,
    permit int not null
);

create table pagamentos(
	id int not null primary key auto_increment,
    valor numeric(10,2) not null,
    data_p date not null,
	realizado boolean not null
);

create table recebimentos(
	id int not null primary key auto_increment,
    valor numeric(10,2) not null,
    data_r date not null,
	realizado boolean not null
);
