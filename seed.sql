INSERT INTO records (title, category, description, status) VALUES
('Broken classroom light', 'Electrical', 'The light in Room B12 does not switch on.', 'Pending'),
('Leaking water tap', 'Plumbing', 'Sink tap in the ground floor restroom is constantly dripping.', 'In progress'),
('Wobbly lecture chair', 'Furniture', 'Front row seat leg is loose and unstable.', 'Completed'),
('Blown projector bulb', 'Electrical', 'Lecture theatre 3 projector lamp needs replacement.', 'Pending'),
('Blocked corridor drain', 'Plumbing', 'Water pooling outside block C hallway after rain.', 'In progress'),
('Broken door handle', 'Furniture', 'Office 14 door handle fell off from the inside.', 'Pending'),
('Faulty wall socket', 'Electrical', 'Computer lab socket sparks when plugged into.', 'Completed'),
('Missing whiteboard eraser', 'Furniture', 'Room A4 needs a replacement eraser and markers.', 'Completed')
ON CONFLICT DO NOTHING;