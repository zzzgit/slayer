const src = [
	1, -1, 1, -1, 0.95, -1, -1, -1, 0.95, 1, -1, -1, -1, 1, 0.95, 1, 1, -1, -1,
	-1, 0.95, 1, 1, -1, 0.95, -1, -1, -1, 1, -1, 0.95, 1, 1, -1, 0.95, 1, -1, -1,
	-1, 1, 0.95, -1, -1, 1, 0.95, -1, -1, 1, -1, -1, -1, -1, -1, 0.95, 0.95, -1,
	1, 1, 1, 1, 1, -1, 0.95, -1, 1, 1, 0.95, 0.95, 0.95, -1, -1, 0.95, -1, -1, 1,
	-1, -1, -1, 1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1, 1, 1, -1, 0.95, 1, -1, 1,
	0.95, 0.95, -1, 0.95, -1, 1, -1, -1, 1, 0.95, 0.95, -1, 1, 0.95, -1, 1, -1,
	0.95, -1, -1, -1, 1, 1, -1, -1, 0.95, 1, -1, 1, -1, 1, -1, -1, 0.95, -1, 1,
	0.95, -1, 1, 0.95, -1, 0.95, 0.95, -1, 0.95, 1, 0.95, 1, 1, -1, 1, -1, -1,
	0.95, -1, 1, -1, -1, -1, 0.95, 0.95, -1, 1, 0.95, 0.95, 1, 0.95, 0.95, 1,
	0.95, 1, 0.95, 0.95, 0.95, -1, 1, 0.95, -1, 0.95, 1, -1, -1, -1, 1, 0.95, -1,
	1, 0.95, 1, -1, 1, 0.95, 1, -1, 0.95, 0.95, -1, 1, -1, 0.95, 0.95, 1, 0.95,
	0.95, 1, 0.95, -1, -1, 1, 0.95, 0.95, -1, 0.95, -1, 0.95, 0.95, 0.95, 1, -1,
	-1, 0.95, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, -1, -1, -1, 0.95, 0.95, 1, -1,
	-1, 0.95, -1, 1, 0.95, -1, 1, 0.95, -1, 0.95, -1, -1, 0.95, -1, -1, -1, -1,
	-1, -1, 1, -1, 0.95, -1, 0.95, -1, -1, 1, -1, 0.95, -1, -1, 0.95, -1, 1, 0.95,
	-1, -1, -1, -1, 0.95, 1, 0.95, 1, 1, 1, 1, -1, -1, 0.95, 0.95, -1, 0.95, 1,
	-1, 0.95, -1, 1, 0.95, 1, -1, -1, 0.95, -1, 0.95, -1, -1, 1, 1, 0.95, 1, -1,
	-1, -1, -1, -1, -1, 0.95, 0.95, 1, 0.95, 0.95, -1, 0.95, -1, 0.95, 0.95, -1,
	-1, 1, 1, -1, -1, 0.95, -1, 0.95, 1, 1, 1, 1, 0.95, -1, -1, 1, -1, 1, 1, -1,
	0.95, -1, 1, 1, -1, 1, 0.95, 1, -1, 1, -1, 1, -1, -1, -1, 0.95, 0.95, 0.95, 1,
	0.95, -1, 1, -1, 0.95, 1, 0.95, -1, 0.95, -1, 0.95, -1, 1, -1, -1, 1, -1, -1,
	1, -1, 0.95, -1, 1, -1, 0.95, -1, -1, -1, -1, -1, -1, 1, 1, -1, 1, -1, -1, 1,
	1, 1, -1, 1, -1, 1, -1, 1, 1, 0.95, 1, 1, 1, -1, -1, -1, 0.95, -1, -1, -1, -1,
	1, -1, 0.95, -1, -1, 1, 1, -1, -1, 0.95, -1, 1, 1, 0.95, 1, 1, 1, -1, 1, 1, 1,
	1, -1, 1, 0.95, -1, 0.95, 1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, 0.95, 0.95,
	-1, -1, 1, 1, -1, -1, 0.95, -1, 0.95, -1, 0.95, -1, 0.95, -1, 1, -1, 1, -1,
	-1, -1, 0.95, -1, -1, 0.95, 1, 0.95, 1, -1, 0.95, -1, 1, 1, -1, -1, -1, 0.95,
	-1, 0.95, -1, 0.95, 0.95, -1, -1, 1, 1, -1, -1, 0.95, 1, -1, -1, -1, -1, -1,
	-1, 1, 0.95, -1, -1, -1, 0.95, 1, 0.95, -1, 1, -1, 0.95, -1, -1, -1, -1, 1,
	-1, 1, -1, 1, -1, -1, 1, -1, -1, -1, -1, 0.95, 0.95, 1, 0.95, 1, 1, -1, -1,
	-1, -1, 0.95, -1, 0.95, 1, -1, 1, 0.95, -1, -1, 1, 1, 1, -1, 1, 1, 1, -1, -1,
	1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, 1, 0.95, -1, -1, 0.95,
	0.95, 1, -1, -1, 1, 1, -1, -1, -1, -1, -1, 1, 1, 0.95, -1, -1, -1, -1, -1,
	0.95, 0.95, 1, 0.95, -1, 1, -1, 0.95, 1, 0.95, -1, 1, 0.95, 1, -1, -1, -1, -1,
	1, -1, 1, -1, 1, 0.95, 1, 1, -1, -1, 0.95, -1, 1, 1, 1, 0.95, 0.95, 1, -1, 1,
	0.95, -1, 0.95, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, -1, -1, -1, 1, 1, 1, -1,
	1, -1, -1, 0.95, -1, 1, -1, -1, -1, 0.95, -1, 0.95, -1, -1, 1, -1, -1, 1,
	0.95, -1, 0.95, -1, -1, -1, 0.95, 0.95, -1, -1, -1, -1, -1, -1, -1, -1, 0.95,
	1, 1, -1, -1, 0.95, -1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, 1, 0.95, 1, -1, 1,
	1, 1, 1, 1, 1, -1, 1, -1, 1, 0.95, 1, -1, 1, 0.95, 1, -1, -1, 1, 1, 1, 1, -1,
	1, -1, -1, -1, 1, -1, -1, 1, 1, 0.95, 0.95, -1, 1, -1, -1, 1, -1, 0.95, -1,
	-1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 1, 1, 1, -1, 0.95, -1, -1, 1, 1, -1,
	0.95, 1, -1, 0.95, -1, 1, 0.95, -1, -1, -1, -1, 0.95, 1, 1, -1, -1, 0.95, -1,
	1, -1, 1, 1, -1, 1, -1, -1, -1, 1, 1, 1, 0.95, -1, -1, 1, 1, -1, 0.95, 0.95,
	-1, -1, -1, 1, 0.95, -1, 1, 0.95, 1, -1, 1, -1, 0.95, 1, -1, 0.95, -1, 1,
	0.95, 1, -1, 0.95, 1, -1, -1, 1, -1, -1, 0.95, -1, 0.95, -1, 1, 1, 1, -1, -1,
	-1, 1, 1, -1, 1, -1, -1, -1, 0.95, -1, 0.95, 1, 1, -1, 0.95, -1, 1, 0.95, -1,
	-1, -1, 1, 0.95, -1, 0.95, 0.95, -1, 1, 1, -1, 0.95, -1, -1, -1, -1, 1, -1,
	-1, -1, 0.95, 1, 1, 1, 0.95, 0.95, 1, -1, 0.95, -1, 0.95, -1, -1, 0.95, -1, 1,
	-1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 0.95, 1, 1, -1, -1, -1, -1, -1, 0.95,
	1, -1, -1, -1, 0.95, 1, -1, 1, -1, -1, -1, 1, 0.95, -1, -1, -1, -1, -1, 1,
	0.95, -1, -1, -1, 0.95, 0.95, 0.95, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, -1,
	0.95, 1, -1, 0.95, 0.95, 0.95, 1, -1, -1, 0.95, 1, -1, 1, 0.95, -1, 0.95, -1,
	0.95, 0.95, 0.95, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, -1, 1, -1,
	1, -1, 0.95, 1, 0.95, 1, -1, -1, -1, -1, -1, -1, 1, 0.95, -1, -1, 1, 0.95, 1,
	1, -1, -1, 0.95, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, -1, 0.95, 1, -1, 0.95,
	-1, -1, 1, -1, 1, 1, 1, -1, -1, -1, 0.95, 0.95, -1, 0.95, 0.95, 0.95, 0.95, 1,
	1, 1, -1, 0.95, 1, 1, 0.95, -1, 0.95, 1, 1, 1, 0.95, 1, 1, -1, -1, 0.95, -1,
	-1, -1, -1, -1, 0.95, 1, 0.95, -1, 0.95, -1, 1, 0.95, 1, 0.95, 0.95, -1, -1,
	-1, 1, -1, 1, -1, -1, 1, -1, -1, 0.95, 0.95, -1, -1, -1, -1, -1, 0.95, -1, -1,
	0.95, 1, 1, -1, 1, 0.95, 1, 1, 1, 0.95, 0.95, 1, 1, -1, -1, 1, 1, 1, 0.95, -1,
	1, -1, -1, -1, 1, -1, -1, -1, 0.95, -1, -1, 0.95, 0.95, 0.95, 0.95, -1, 1, 1,
	-1, 1, -1, 0.95, 0.95, 1, 0.95, 1, -1, -1, -1, 1, 1, -1, 1, 1, 0.95, -1, -1,
	-1, -1, 0.95, -1, 0.95, 1, 1, 0.95, 0.95, 0.95, -1, -1, 1, -1, 0.95, -1, 1, 1,
	-1, -1, -1, 0.95, -1, -1, -1, 1, -1, 0.95, 1, -1, -1, -1, -1, 1, 1, 0.95, -1,
	-1, 0.95, -1, 1, 0.95, -1, -1, 0.95, 0.95, -1, 0.95, -1, -1, -1, -1, 0.95,
	0.95, 1, -1, -1, -1, 0.95, -1, -1, 1, -1, -1, 0.95, 1, 1, 1, -1, -1, 0.95, -1,
	0.95, -1, 0.95, -1, -1, -1, -1, -1, 0.95, 0.95, 1, -1, 1, 1, -1, 0.95, -1, -1,
	1, -1, -1, -1, -1, 1, -1, -1, 0.95, -1, 1, -1, 1, 1, 0.95, -1, -1, 0.95, 0.95,
	1, -1, -1, -1, 0.95, -1, 1, 0.95, 0.95, 1, -1, 0.95, 1, 1, -1, 1, -1, 0.95,
	-1, 1, -1, -1, -1, 1, -1, -1, 0.95, 1, 0.95, -1, -1, -1, 0.95, 0.95, -1, 0.95,
	0.95, -1, 1, 1, -1, -1, -1, -1, -1, -1, 0.95, -1, 1, 1, -1, 0.95, -1, 1, 0.95,
	-1, -1, -1, 1, -1, -1, 1, 0.95, 1, 1, -1, 0.95, -1, -1, 1, -1, -1, 0.95, -1,
	0.95, -1, -1, -1, 1, -1, 0.95, -1, -1, -1, -1, -1, -1, 0.95, -1, -1, -1, 1, 1,
	-1, 0.95, -1, -1, -1, 0.95, -1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1, -1, -1,
	1, 0.95, 1, -1, -1, -1, 0.95, 1, -1, -1, -1, -1, -1, 1, -1, 0.95, 0.95, -1,
	0.95, 0.95, 1, 0.95, 0.95, -1, 0.95, -1, 1, 1, 0.95, -1, 0.95, -1, -1, -1, -1,
	1, -1, -1, -1, 1, 1, -1, 0.95, -1, 1, -1, 0.95, 1, -1, 0.95, -1, 0.95, -1, 1,
	-1, -1, -1, -1, 1, 0.95, -1, 0.95, -1, -1, -1, -1, 0.95, 0.95, 1, 0.95, -1,
	-1, -1, 1, 1, 1, -1, -1, -1, 0.95, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 0.95,
	0.95, -1, 1, 0.95, 0.95, 0.95, -1, -1, 1, -1, 0.95, -1, 0.95, -1, -1, 1, 1,
	0.95, 0.95, -1, -1, 1, -1, 0.95, 0.95, 1, -1, 1, 0.95, 1, 1, -1, 1, -1, 0.95,
	-1, -1, 0.95, 0.95, 1, 1, -1, 1, 0.95, -1, 1, -1, 1, 0.95, 0.95, -1, 1, -1,
	-1, -1, 1, -1, -1, -1, -1, 0.95, 1, 1, 1, -1, -1, 0.95, -1, -1, -1, 0.95, 1,
	1, -1, -1, 0.95, -1, 1, 1, 0.95, 1, 1, 1, -1, 0.95, 0.95, 0.95, -1, 1, 0.95,
	-1, 1, 0.95, -1, 0.95, 1, 1, 1, 1, 0.95, -1, 1, -1, 1, -1, 0.95, 1, -1, -1, 1,
	-1, 0.95, -1, 0.95, -1, 1, 1, 1, -1, 0.95, -1, -1, 1, -1, 0.95, 0.95, 1, 1,
	-1, -1, -1, -1, -1, 0.95, 1, 0.95, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, 0.95,
	-1, -1, 1, -1, -1, 0.95, -1, 1, -1, 1, 0.95, 0.95, 0.95, 1, -1, -1, 1, 1, -1,
	-1, -1, -1, -1, 1, 0.95, -1, 0.95, 1, 1, -1, -1, 1, -1, 0.95, -1, -1, 0.95,
	-1, 1, -1, 1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, 1, -1, 1, -1, -1, 1, -1,
	0.95, -1, 0.95, -1, 0.95, -1, 0.95, 0.95, -1, -1, -1, -1, 0.95, 0.95, -1, -1,
	-1, -1, -1, 1, 0.95, -1, -1, 0.95, 1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1,
	1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 0.95, 1, 0.95, 1, 0.95, -1, 0.95,
	0.95, 0.95, -1, -1, -1, -1, -1, -1, 0.95, -1, 1, 0.95, 1, -1, 1, -1, 0.95,
	0.95, -1, 1, -1, -1, 0.95, -1, -1, -1, 0.95, 0.95, 1, 0.95, -1, 1, 0.95, -1,
	-1, -1, 1, 1, 1, 1, -1, 0.95, 1, 0.95, -1, 0.95, 1, 1, 1, -1, -1, -1, 0.95,
	-1, 1, 1, -1, 1, 0.95, -1, -1, 1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, 1, -1,
	-1, -1, 1, 0.95, 1, -1, -1, -1, -1, 1, -1, 0.95, 1, 0.95, 0.95, -1, -1, 1, -1,
	0.95, 0.95, -1, 1, -1, 1, -1, -1, 1, 0.95, -1, 0.95, 0.95, -1, -1, -1, 0.95,
	0.95, -1, 1, 0.95, -1, -1, 0.95, 0.95, 0.95, -1, 1, 1, 1, -1, 0.95, 1, 1,
	0.95, -1, 0.95, -1, 0.95, 1, -1, -1, -1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1,
	0.95, 1, 0.95, -1, 0.95, -1, -1, -1, -1, -1, -1, -1, 0.95, -1, -1, -1, -1, 1,
	-1, 1, 0.95, -1, -1, -1, -1, -1, -1, 1, 0.95, -1, -1, 1, -1, 1, 1, 1, -1, -1,
	1, -1, 1, 1, 1, 0.95, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 0.95, 1, -1, -1, -1,
	1, 1, -1, 0.95, -1, -1, -1, 0.95, -1, -1, 0.95, 0.95, -1, 1, 1, -1, -1, 1, 1,
	-1, -1, 0.95, -1, 0.95, 1, -1, 1, -1, -1, 1, 1, 1, 1, 0.95, 0.95, -1, -1, -1,
	1, -1, 1, -1, 0.95, -1, -1, -1, 1, 0.95, -1, 1, 0.95, 0.95, 0.95, -1, -1, -1,
	1, 1, -1, -1, 1, 0.95, -1, 1, 1, 0.95, 0.95, -1, 0.95, 0.95, 0.95, -1, -1, -1,
	1, -1, -1, 0.95, 1, 0.95, -1, -1, -1, 0.95, 1, -1, 0.95, -1, 1, -1, -1, 1, -1,
	0.95, -1, 1, -1, 0.95, -1, 0.95, -1, 1, 1, 0.95, 1, -1, 0.95, -1, 0.95, 1, -1,
	1, 0.95, 1, 1, -1, 0.95, 1, -1, 0.95, 0.95, 1, 0.95, 0.95, -1, -1, -1, -1, 1,
	-1, -1, -1, 0.95, -1, -1, -1, 0.95, -1, -1, -1, 0.95, 1, -1, -1, -1, 0.95, -1,
	1, 1, -1, -1, 0.95, -1, 0.95, 1, -1, 1, -1, -1, 0.95, 1, 0.95, 1, -1, 1, -1,
	-1, 1, 1, 0.95, 1, 1, -1, 0.95, -1, 0.95, 1, 0.95, -1, -1, -1, 0.95, 1, -1,
	0.95, -1, -1, 1, 0.95, -1, -1, 1, -1, 1, 1, 1, -1, 0.95, -1, -1, 0.95, 0.95,
	-1, -1, -1, 1, 1, -1, 0.95, 1, 1, -1, -1, -1, -1, -1, -1, 0.95, 0.95, 0.95, 1,
	-1, 0.95, 0.95, -1, 0.95, 0.95, -1, -1, -1, -1, 0.95, 0.95, 1, 1, -1, -1, 1,
	-1, 1, -1, 0.95, 0.95, -1, -1, 1, 0.95, -1, 0.95, 1, 0.95, 1, 0.95, -1, 0.95,
	1, -1, -1, -1, -1, 0.95, -1, -1, -1, 1, -1, 1, 0.95, 1, 0.95, -1, -1, 0.95,
	-1, 1, 1, -1, 1, -1, 1, 0.95, -1, -1, 1, -1, 0.95, 0.95, -1, -1, -1, 1, 1,
	0.95, 1, -1, 1, -1, 1, -1, -1, -1, 1, 0.95, -1, -1, 0.95, -1, 0.95, -1, -1,
	-1, 1, -1, -1, 1, 1, -1, 0.95, 0.95, -1, 0.95, 1, -1, 1, -1, -1, 0.95, 0.95,
	1, 1, 0.95, 1, 0.95, -1, -1, 1, -1, -1, 0.95, 0.95, -1, 0.95, -1, -1, 0.95,
	0.95, 1, 1, 0.95, 0.95, 0.95, -1, -1, 0.95, 1, 1, 0.95, 1, -1, 1, -1, 1, -1,
	0.95, -1, 1, 0.95, 0.95, 0.95, 1, 0.95, -1, -1, 1, 0.95, 0.95, -1, 0.95, -1,
	1, 0.95, 1, -1, -1, 0.95, 0.95, 0.95, -1, 1, 0.95, -1, 0.95, 0.95, -1, -1, -1,
	-1, 0.95, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, 0.95,
	-1, 0.95, 1, -1, 0.95, -1, 1, 1, 0.95, 1, 0.95, -1, -1, 1, -1, 0.95, 0.95, -1,
	0.95, -1, 0.95, -1, 1, -1, 0.95, 0.95, 1, -1, 1, 1, -1, -1, -1, 1, -1, 0.95,
	0.95, 1, 0.95, 0.95, -1, 0.95, 0.95, -1, -1, 0.95, -1, -1, 0.95, -1, 1, 1, -1,
	1, -1, 1, 0.95, 1, 0.95, -1, 1, -1, -1, -1, 0.95, -1, 1, 1, -1, -1, -1, -1,
	0.95, 0.95, -1, -1, 1, 0.95, -1, 1, -1, 1, 1, 0.95, 0.95, -1, -1, 0.95, 0.95,
	-1, -1, -1, -1, 0.95, -1, -1, -1, 1, 0.95, -1, -1, -1, -1, -1, -1, -1, 0.95,
	1, 1, 1, -1, -1, 1, -1, 0.95, 0.95, 1, -1, 1, -1, 1, 0.95, -1, 1, 1, -1, -1,
	-1, -1, -1, 0.95, -1, 1, 0.95, 0.95, 0.95, -1, -1, 0.95, 0.95, 0.95, 1, -1,
	-1, 0.95, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 0.95, 0.95, 0.95, 1, 0.95,
	-1, 0.95, 0.95, 0.95, -1, 0.95, -1, 1, -1, -1, -1, -1, 1, -1, 1, 0.95, -1,
	0.95, -1, -1, 1, 0.95, 0.95, -1, 0.95, -1, 1, -1, -1, 0.95, 1, 0.95, -1, 0.95,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, 0.95, 0.95, 0.95, 1, 0.95, -1, -1, 1, 1,
	-1, -1, 0.95, -1, 1, 1, 1, 1, 0.95, 1, -1, -1, 1, 0.95, -1, -1, 0.95, -1, 1,
	-1, 0.95, -1, 1, -1, -1, 0.95, -1, 0.95, 1, 0.95, 0.95, 0.95, -1, 1, 1, -1,
	-1, -1, 1, 1, 0.95, 0.95, -1, 0.95, -1, 1, 1, -1, -1, 1, -1, -1, 0.95, -1, -1,
	1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, 1, 1, 1, 1, 1, -1,
	0.95, 0.95, -1, 1, -1, -1, 1, -1, 0.95, 1, 0.95, -1, 1, 1, 0.95, 1, 1, 1,
	0.95, -1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, 1, 0.95, 0.95, 1, 0.95, -1, -1, 1,
	-1, 1, -1, -1, -1, 0.95, -1, -1, -1, 0.95, 0.95, -1, -1, -1, 0.95, -1, 1, -1,
	1, 1, -1, -1, 0.95, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, -1, -1, 0.95, 0.95, -1,
	0.95, 1, 1, -1, 0.95, 1, -1, 0.95, 0.95, -1, -1, -1, 1, -1, 1, -1, -1, -1, -1,
	-1, 0.95, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, 1, 0.95, 1, 1,
	-1, -1, -1, -1, -1, 1, -1, 0.95, -1, -1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 1,
	0.95, 1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 0.95, -1, 0.95, 1, -1, -1, 1, -1,
	-1, -1, 0.95, 1, -1, -1, -1, -1, 1, -1, -1, -1, 0.95, 1, 1, -1, 0.95, 1, 0.95,
	-1, -1, 1, 1, -1, 0.95, -1, -1, 0.95, 1, -1, -1, 0.95, 0.95, 0.95, 1, -1, -1,
	-1, 1, 0.95, -1, -1, 0.95, 1, -1, 1, 1, 1, 1, -1, -1, -1, -1, 0.95, -1, 0.95,
	1, 1, 0.95, 0.95, 1, 1, -1, 0.95, 0.95, -1, -1, 1, 0.95, 1, 1, 1, -1, 0.95,
	-1, -1, -1, -1, 1, 1, -1, -1, -1, -1, 1, 0.95, 1, 1, 1, -1, 1, 0.95, 1, 1, 1,
	1, 1, -1, 1, -1, 1, -1, -1, 0.95, -1, 0.95, -1, 0.95, 0.95, 1, 1, -1, 1, -1,
	-1, 1, 1, -1, 1, 0.95, 0.95, -1, -1, 1, -1, 1, -1, -1, 0.95, -1, 0.95, -1, 1,
	-1, -1, 1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 0.95, -1, -1,
	-1, 1, 0.95, -1, -1, 0.95, -1, 1, -1, 1, 1, 0.95, 0.95, -1, 0.95, 0.95, 1, -1,
	-1, -1, 0.95, 0.95, 1, -1, 1, 1, -1, 1, -1, -1, 0.95, -1, 1, -1, -1, -1, 0.95,
	1, 1, 0.95,
]

export default src
