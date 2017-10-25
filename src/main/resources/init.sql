DROP sequence UNIVERSAL_SCHEDULE_PK_SEQ;
DROP sequence UNIVERSAL_TASK_BASE_PK_SEQ;
DROP sequence SCHEDULE_PK_SEQ;
DROP sequence TASK_PK_SEQ;
DROP sequence UNIVERSAL_TASK_PK_SEQ;
DROP sequence DATA_PK_SEQ;
DROP SEQUENCE ACT_EVT_LOG_SEQ;

create sequence UNIVERSAL_SCHEDULE_PK_SEQ;
create sequence UNIVERSAL_TASK_BASE_PK_SEQ;
create sequence SCHEDULE_PK_SEQ;
create sequence TASK_PK_SEQ;
create sequence UNIVERSAL_TASK_PK_SEQ;
create sequence DATA_PK_SEQ;

drop table DATA cascade constraints;
drop table IOT_TASK cascade constraints;
drop table SCHEDULE cascade constraints;
drop table SCHEDULE_DATA cascade constraints;
drop table SCHEDULE_TASK cascade constraints;
drop table TASK_DATA cascade constraints;
drop table UNIVERSAL_SCHEDULE cascade constraints;
drop table UNIVERSAL_SCHEDULE_DATA cascade constraints;
drop table UNIVERSAL_SCHEDULE_TASK cascade constraints;
drop table UNIVERSAL_TASK cascade constraints;
drop table UNIVERSAL_TASK_BASE cascade constraints;
drop table UNIVERSAL_TASK_DATA cascade constraints;
drop TABLE SECRET_LEVEL CASCADE CONSTRAINTS;
drop TABLE ACT_EVT_LOG CASCADE CONSTRAINTS;
drop TABLE ACT_GE_BYTEARRAY CASCADE CONSTRAINTS;
drop TABLE ACT_GE_PROPERTY CASCADE CONSTRAINTS;
drop TABLE ACT_HI_ACTINST CASCADE CONSTRAINTS;
drop TABLE ACT_HI_ATTACHMENT CASCADE CONSTRAINTS;
drop TABLE ACT_HI_COMMENT CASCADE CONSTRAINTS;
drop TABLE ACT_HI_DETAIL CASCADE CONSTRAINTS;
drop TABLE ACT_HI_IDENTITYLINK CASCADE CONSTRAINTS;
drop TABLE ACT_HI_PROCINST CASCADE CONSTRAINTS;
drop TABLE ACT_HI_TASKINST CASCADE CONSTRAINTS;
drop TABLE ACT_HI_VARINST CASCADE CONSTRAINTS;
drop TABLE ACT_ID_GROUP CASCADE CONSTRAINTS;
drop TABLE ACT_ID_INFO CASCADE CONSTRAINTS;
drop TABLE ACT_ID_MEMBERSHIP CASCADE CONSTRAINTS;
drop TABLE ACT_ID_USER CASCADE CONSTRAINTS;
drop TABLE ACT_PROCDEF_INFO CASCADE CONSTRAINTS;
drop TABLE ACT_RE_DEPLOYMENT CASCADE CONSTRAINTS;
drop TABLE ACT_RE_MODEL CASCADE CONSTRAINTS;
drop TABLE ACT_RE_PROCDEF CASCADE CONSTRAINTS;
drop TABLE ACT_RU_EVENT_SUBSCR CASCADE CONSTRAINTS;
drop TABLE ACT_RU_EXECUTION CASCADE CONSTRAINTS;
drop TABLE ACT_RU_IDENTITYLINK CASCADE CONSTRAINTS;
drop TABLE ACT_RU_JOB CASCADE CONSTRAINTS;
drop TABLE ACT_RU_TASK CASCADE CONSTRAINTS;
drop TABLE ACT_RU_VARIABLE CASCADE CONSTRAINTS;

create or replace synonym iot_cust for ils.cust;
create or replace synonym iot_corp for ils.corp;

create table DATA
(
  id           NUMBER not null,
  name         VARCHAR2(100) not null,
  abbr         VARCHAR2(50) not null,
  code         VARCHAR2(50) not null,
  fill         NUMBER not null,
  frequency    NUMBER not null,
  input_output VARCHAR2(10),
  type         VARCHAR2(10) not null,
  security_level	NUMBER,
  value        VARCHAR2(200),
  parent       NUMBER ,
  sort         NUMBER not null
);
create table IOT_TASK
(
  ID NUMBER not null
    constraint TASK_PK
      primary key,
  state               VARCHAR2(200),
  start_time          DATE,
  end_time            DATE,
  security_level	  NUMBER not null,
  priority            NUMBER(2) not null,
  responsible         NUMBER,
  milestone           NUMBER,
  resources           VARCHAR2(10),
  universal_task      VARCHAR2(100),
  form                VARCHAR2(10),
  create_time         DATE default sysdate not null,
  update_time         DATE default sysdate not null,
  status              VARCHAR2(10) not null,
  universal_task_base VARCHAR2(100),
  accept_time         DATE,
  finish_time         DATE,
  parent              NUMBER,
  sort                NUMBER not null
);
create table SCHEDULE
(
  id                 NUMBER not null,
  code               VARCHAR2(50),
  name               VARCHAR2(100) not null,
  state              VARCHAR2(200),
  start_time         DATE not null,
  end_time           DATE not null,
  security_level	 NUMBER not null,
  priority           NUMBER(2),
  responsible        NUMBER not null,
  type               VARCHAR2(10),
  task               NUMBER,
  partner            VARCHAR2(100),
  create_time        DATE default sysdate not null,
  update_time        DATE default sysdate not null,
  resolved           VARCHAR2(2) not null,
  status             VARCHAR2(10) not null,
  processinstance_id VARCHAR2(10),
  progress           NUMBER(3,2) default 0.00 not null,
  approve_time       DATE,
  finish_time        DATE,
  category           VARCHAR2(10),
  source_id          NUMBER
);
create table SCHEDULE_DATA
(
  schedule_id NUMBER not null,
  data_id     NUMBER not null
);
alter table SCHEDULE_DATA
  add unique (DATA_ID);

create table SCHEDULE_TASK
(
  schedule_id NUMBER not null,
  task_id     NUMBER not null,
  task_name   VARCHAR2(100) not null
);
create table TASK_DATA
(
  task_id NUMBER not null,
  data_id NUMBER not null
);
create table UNIVERSAL_SCHEDULE
(
  name        VARCHAR2(100) not null,
  state       VARCHAR2(200),
  create_time DATE default sysdate not null,
  id          NUMBER not null
);
create table UNIVERSAL_SCHEDULE_DATA
(
  schedule_id NUMBER not null,
  data_id     NUMBER not null
);
create table UNIVERSAL_SCHEDULE_TASK
(
  schedule_id NUMBER not null,
  task_id     NUMBER not null,
  task_name   VARCHAR2(100) not null
);
create table UNIVERSAL_TASK
(
  id        NUMBER not null,
  name      VARCHAR2(100) not null,
  state     VARCHAR2(200),
  duration  NUMBER not null,
  priority  NUMBER not null,
  milestone NUMBER not null,
  base      NUMBER not null,
  form      VARCHAR2(10)
);
create table UNIVERSAL_TASK_BASE
(
  id          NUMBER not null,
  name        VARCHAR2(100) not null,
  state       VARCHAR2(200),
  create_time DATE default sysdate
);
create table UNIVERSAL_TASK_DATA
(
  task_id NUMBER not null,
  data_id NUMBER not null
);

alter table TASK_DATA
  add unique (DATA_ID);

alter table UNIVERSAL_SCHEDULE_DATA
  add unique (DATA_ID);
alter table DATA
  add constraint SELFADD primary key (ID);
alter table SCHEDULE
  add constraint SCHEDULE_PK primary key (ID);
alter table SCHEDULE
  add constraint SCHEDULE_CODE_UK unique (CODE);
alter table SCHEDULE
  add constraint SCHEDULE_NAME_UK unique (NAME);
alter table SCHEDULE
  add constraint SCHEDULE_TASK_UK unique (TASK);
alter table SCHEDULE
  add constraint SCHEDULE_TASK_TASK_ID_FK foreign key (TASK)
  references IOT_TASK (ID);

alter table SCHEDULE_TASK
  add constraint SCHEDULE_TASK_PK primary key (SCHEDULE_ID, TASK_ID);
alter table SCHEDULE_TASK
  add constraint SCHEDULE_ID_TASK_NAME_UK unique (SCHEDULE_ID, TASK_NAME);
alter table SCHEDULE_TASK
  add constraint SCHEDULE_ID_FK foreign key (SCHEDULE_ID)
  references SCHEDULE (ID);
alter table SCHEDULE_TASK
  add constraint TASK_ID_FK foreign key (TASK_ID)
  references IOT_TASK (ID);

alter table UNIVERSAL_SCHEDULE
  add constraint UNIVERSAL_SCHEDULE_PK primary key (ID);
alter table UNIVERSAL_SCHEDULE
  add constraint UNIVERSAL_SCHEDULE_NAME_UK unique (NAME);

alter table UNIVERSAL_TASK
  add constraint ID primary key (ID);

alter table UNIVERSAL_TASK_BASE
  add constraint UNIVERSAL_TASK_BASE_PK primary key (ID);
alter table UNIVERSAL_TASK_BASE
  add constraint UNIVERSAL_TASK_BASE_NAME_UK unique (NAME);

alter table UNIVERSAL_TASK_DATA
  add constraint DATA_ID unique (DATA_ID);
  
create table SECRET_LEVEL
(
  id   NUMBER not null,
  name VARCHAR2(10) not null,
  code NUMBER not null
)
;
alter table SECRET_LEVEL
  add constraint SECRET_LEVEL primary key (ID);

insert into SECRET_LEVEL (id, name, code)
values (1, '机密', 51);
insert into SECRET_LEVEL (id, name, code)
values (2, '秘密', 41);
insert into SECRET_LEVEL (id, name, code)
values (3, '内部', 31);
insert into SECRET_LEVEL (id, name, code)
values (4, '非密', 21);
commit;
