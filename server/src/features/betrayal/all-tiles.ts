export interface Tile {
	connection: ('top' | 'bottom' | 'left' | 'right')[];
	floor: (0 | 1 | 2)[];
	name: string;
	img: string;
}


export const allTiles: Tile[] = [
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'chasm',
		img:        'https://media.newyorker.com/photos/64e7fb05eeb2b9a4560ab8c9/master/w_2560%2Cc_limit/Trump-Mugshot-Final.jpg',
	},
	{
		connection: [ 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'kitchen',
		img:        'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/X5TDSC3GQRMKZAHJ4HGFJGNTJE.jpg',
	},
];
