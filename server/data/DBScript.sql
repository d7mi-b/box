create database Box;

use Box;

create table categories (
	id varchar(200) primary key default(uuid()),
	category varchar(200) not null
);

create table cities (
	id varchar(200) primary key default(uuid()),
    city varchar(200) not null
    latitude varchar(200),
    longitude varchar(200),
    status boolean,
    unique(latitude, longitude)
);

create table driver (
	id varchar(200) primary key default(uuid()),
    name varchar(200) not null,
    email varchar(200) not null unique,
    phone varchar(200) not null unique,
    password varchar(300) not null
);

create table trucks (
	id varchar(200) primary key default(uuid()),
    number varchar(200) not null unique,
    capacity int not null,
    status varchar(100),
    driver_id varchar(200),
    foreign key (driver_id) references driver(id)
);

create table shipment (
	id varchar(200) primary key default(uuid()),
    from_city_id varchar(200) not null,
    to_city_id varchar(200) not null,
    category_id varchar(200) not null,
    quantity varchar(200),
    date_of_shipment timestamp not null,
    owner_name varchar(200) not null,
    owner_email varchar(200) not null,
    owner_phone varchar(200) not null,
    status boolean,
    stage varchar(200),
    truck_id varchar(200),
    created_at timestamp default(current_timestamp()),
    foreign key(from_city_id) references cities(id),
    foreign key(to_city_id) references cities(id),
    foreign key(category_id) references categories(id),
    foreign key(truck_id) references trucks(id)
);

create table bills (
	id varchar(200) primary key default(uuid()),
    shipment_id varchar(200) not null unique,
    price decimal(10, 2),
    image varchar(500),
    status boolean
);
    