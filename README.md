# subs
before runing this repo. create a db called subs in postgres
create 2 schemas under this db.  app_public and app_private

this repo is configured assuming the db user name is postgres and same for the password
you will need to look up your ip to set the db url

create this function in private

create or replace function
  app_private.validate_subscription(topic text)
  returns text as
$$
 select 'CANCEL_ALL_SUBSCRIPTIONS'::text;
$$ language sql stable;


Create this table in public
create table if not exists app_public.foo (
 id serial primary key,
 title text not null
);



clone this repo and install
