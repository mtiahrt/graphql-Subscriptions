# subs

before runing this repo. create a db called subs in postgres
create 2 schemas under this db. app_public and app_private

this repo is configured assuming the db user name is postgres and same for the password
you will need to look up your ip to set the db url

Create this table in public

```
create table if not exists app_public.foo (
 id serial primary key,
 title text not null
);
```

create this function in private
```
CREATE OR REPLACE FUNCTION app_private.notify_foo_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
	 perform pg_notify( 'postgraphile:fooInsertHappen',
  		json_build_object('__node__', 
    		json_build_array('foos',(select max(id) from app_public.foo))
  		)::text
	  );
return NEW;
END;
$function$
;
```

create this function in private for canceling notifications.  I think...
```
CREATE OR REPLACE FUNCTION app_private.validate_subscription(topic text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
 select 'CANCEL_ALL_SUBSCRIPTIONS'::text;
$function$
;


```

Next create this trigger in for the foo table

```
create trigger foo_inserts after
insert
    on
    app_public.foo for each row execute function app_private.notify_foo_insert()
```


clone this repo and install <br>
npm install <br>
npm run <br>
open the url <br>
http://localhost:5000/graphiql <br>
run this graphql query

```
subscription {
  listen(topic: "fooInsertHappen") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Foo {
        id
        title
      }
    }
  }
}
```

you are now listening for a subscription

next run this postgres insert in dbeaver under the public schema <br>
```
INSERT INTO app_public.foo
(title)
VALUES('Brookie''s Topic');
```

You should see the notification in the browser
