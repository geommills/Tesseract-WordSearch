BEGIN TRANSACTION;

DROP TABLE IF EXISTS todo_item;
DROP TABLE IF EXISTS geo_synch_event;

CREATE TABLE todo_item (
	id INTEGER PRIMARY KEY, 
	description TEXT, 
	status TEXT
);

CREATE TABLE geo_synch_event (
	id INTEGER PRIMARY KEY,
	queue_name TEXT,
	request_type TEXT,
	queued_timestamp TEXT,
	begin_process_timestamp TEXT,
	end_process_timestamp TEXT,
	synch_status TEXT,
	event_data TEXT,
	result_message TEXT
);

INSERT INTO todo_item(description, status)
VALUES ('Get groceries', 'Incomplete');

INSERT INTO todo_item(description, status)
VALUES ('Walk the dog', 'Incomplete');

INSERT INTO todo_item(description, status) 	
VALUES ('Do the dishes', 'Incomplete');

INSERT INTO geo_synch_event(queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES ('TodoDataSynch', 'UpdateTodoItem', '2013-12-19T14:37:11-08:00', null, null, 'Queued', '{"id":1,"status":"Complete"}', null);
INSERT INTO geo_synch_event(queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES ('TodoDataSynch', 'UpdateTodoItemSynch', '2013-12-19T14:37:11-08:00', null, null, 'Queued', '{"id":1,"status":"Complete"}', null);
INSERT INTO geo_synch_event(queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES ('TodoDataSynch', 'NewTodoItem', '2013-12-19T14:37:11-08:00', null, null, 'Queued', '{"description":"Call Dentist","status":"Incomplete"}', null);
INSERT INTO geo_synch_event(queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES ('TodoDataSynch', 'NewTodoItemSynch', '2013-12-19T14:37:11-08:00', null, null, 'Queued', '{"description":"Call Dentist","status":"Incomplete"}', null);
INSERT INTO geo_synch_event(queue_name, request_type, queued_timestamp, begin_process_timestamp, end_process_timestamp, synch_status, event_data, result_message)
VALUES ('TodoDataSynch', 'NewTodoItem', '2013-12-19T14:37:11-08:00', null, null, 'Queued', '{"description":"This One Should Break","status":"Incomplete","badfield":"badvalue"}', null);

COMMIT;
