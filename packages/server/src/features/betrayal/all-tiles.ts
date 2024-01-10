import dotenv from 'dotenv';


export interface Tile {
	connection: ('top' | 'bottom' | 'left' | 'right')[];
	floor: (0 | 1 | 2)[];
	name: string;
	img: string;
}


dotenv.config();
const port = process.env['PORT'];
const imgUrl = (name: string) => 'http://localhost:' + port + '/assets/betrayal/tiles/' + name + '.png';


export const allTiles: Tile[] = [
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'abandoned_room',
		img:        imgUrl('abandoned_room'),
	},
	{
		connection: [ 'bottom', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'arsenal',
		img:        imgUrl('arsenal'),
	},
	{
		connection: [ 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'attic',
		img:        imgUrl('attic'),
	},
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'balcony',
		img:        imgUrl('balcony'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'ballroom',
		img:        imgUrl('ballroom'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'basement_landing',
		img:        imgUrl('basement_landing'),
	},
	{
		connection: [ 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'bathroom',
		img:        imgUrl('bathroom'),
	},
	{
		connection: [ 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'bedroom',
		img:        imgUrl('bedroom'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'bloody_room',
		img:        imgUrl('bloody_room'),
	},
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'catacombs',
		img:        imgUrl('catacombs'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'cave',
		img:        imgUrl('cave'),
	},
	{
		connection: [ 'top' ],
		floor:      [ 0, 1, 2 ],
		name:       'chapel',
		img:        imgUrl('chapel'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'charred_room',
		img:        imgUrl('charred_room'),
	},
	{
		connection: [ 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'chasm',
		img:        imgUrl('chasm'),
	},
	{
		connection: [ 'top' ],
		floor:      [ 0, 1, 2 ],
		name:       'coal_chute',
		img:        imgUrl('coal_chute'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'collapsed_room',
		img:        imgUrl('collapsed_room'),
	},
	{
		connection: [ 'top' ],
		floor:      [ 0, 1, 2 ],
		name:       'conservatory',
		img:        imgUrl('conservatory'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'creaky_hallway',
		img:        imgUrl('creaky_hallway'),
	},
	{
		connection: [ 'top' ],
		floor:      [ 0, 1, 2 ],
		name:       'crypt',
		img:        imgUrl('crypt'),
	},
	{
		connection: [ 'top', 'left' ],
		floor:      [ 0, 1, 2 ],
		name:       'dining_room',
		img:        imgUrl('dining_room'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'drawing_room',
		img:        imgUrl('drawing_room'),
	},
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'dungeon',
		img:        imgUrl('dungeon'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'dusty_hallway',
		img:        imgUrl('dusty_hallway'),
	},
	{
		connection: [ 'top', 'bottom', 'left' ],
		floor:      [ 0, 1, 2 ],
		name:       'furnace_room',
		img:        imgUrl('furnace_room'),
	},
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'gallery',
		img:        imgUrl('gallery'),
	},
	{
		connection: [ 'top', 'bottom', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'game_room',
		img:        imgUrl('game_room'),
	},
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'gardens',
		img:        imgUrl('gardens'),
	},
	{
		connection: [ 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'graveyard',
		img:        imgUrl('graveyard'),
	},
	{
		connection: [ 'bottom', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'gymnasium',
		img:        imgUrl('gymnasium'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'junk_room',
		img:        imgUrl('junk_room'),
	},
	{
		connection: [ 'top', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'kitchen',
		img:        imgUrl('kitchen'),
	},
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'larder',
		img:        imgUrl('larder'),
	},
	{
		connection: [ 'bottom', 'left' ],
		floor:      [ 0, 1, 2 ],
		name:       'laundry',
		img:        imgUrl('laundry'),
	},
	{
		connection: [ 'bottom', 'left' ],
		floor:      [ 0, 1, 2 ],
		name:       'library',
		img:        imgUrl('library'),
	},
	{
		connection: [ 'top', 'bottom', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'locked_room',
		img:        imgUrl('locked_room'),
	},
	{
		connection: [ 'top', 'left' ],
		floor:      [ 0, 1, 2 ],
		name:       'master_bedroom',
		img:        imgUrl('master_bedroom'),
	},
	{
		connection: [ 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'menagerie',
		img:        imgUrl('menagerie'),
	},
	{
		connection: [ 'top' ],
		floor:      [ 0, 1, 2 ],
		name:       'mystic_elevator',
		img:        imgUrl('mystic_elevator'),
	},
	{
		connection: [ 'top', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'nursery',
		img:        imgUrl('nursery'),
	},
	{
		connection: [ 'bottom', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'operating_laboratory',
		img:        imgUrl('operating_laboratory'),
	},
	{
		connection: [ 'bottom', 'left' ],
		floor:      [ 0, 1, 2 ],
		name:       'organ_room',
		img:        imgUrl('organ_room'),
	},
	{
		connection: [ 'left' ],
		floor:      [ 0, 1, 2 ],
		name:       'panic_room',
		img:        imgUrl('panic_room'),
	},
	{
		connection: [ 'top', 'bottom', 'left' ],
		floor:      [ 0, 1, 2 ],
		name:       'patio',
		img:        imgUrl('patio'),
	},
	{
		connection: [ 'left' ],
		floor:      [ 0, 1, 2 ],
		name:       'pentagram_chamber',
		img:        imgUrl('pentagram_chamber'),
	},
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'research_laboratory',
		img:        imgUrl('research_laboratory'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'roof_landing',
		img:        imgUrl('roof_landing'),
	},
	{
		connection: [ 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'rookery',
		img:        imgUrl('rookery'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'servants_quarters',
		img:        imgUrl('servants_quarters'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'sewing_room',
		img:        imgUrl('sewing_room'),
	},
	{
		connection: [ 'top' ],
		floor:      [ 0, 1, 2 ],
		name:       'solarium',
		img:        imgUrl('solarium'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'spiral_staircase',
		img:        imgUrl('spiral_staircase'),
	},
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'stairs_from_basement',
		img:        imgUrl('stairs_from_basement'),
	},
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'statuary_corridor',
		img:        imgUrl('statuary_corridor'),
	},
	{
		connection: [ 'top' ],
		floor:      [ 0, 1, 2 ],
		name:       'storeroom',
		img:        imgUrl('storeroom'),
	},
	{
		connection: [ 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'storm_cellar',
		img:        imgUrl('storm_cellar'),
	},
	{
		connection: [ 'bottom', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'study',
		img:        imgUrl('study'),
	},
	{
		connection: [ 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'theater',
		img:        imgUrl('theater'),
	},
	{
		connection: [ 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'tower',
		img:        imgUrl('tower'),
	},
	{
		connection: [ 'bottom', 'left' ],
		floor:      [ 0, 1, 2 ],
		name:       'tree_house',
		img:        imgUrl('tree_house'),
	},
	{
		connection: [ 'top', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'underground_lake',
		img:        imgUrl('underground_lake'),
	},
	{
		connection: [ 'top', 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'upper_landing',
		img:        imgUrl('upper_landing'),
	},
	{
		connection: [ 'top' ],
		floor:      [ 0, 1, 2 ],
		name:       'vault',
		img:        imgUrl('vault'),
	},
	{
		connection: [ 'bottom', 'left', 'right' ],
		floor:      [ 0, 1, 2 ],
		name:       'widows_walk',
		img:        imgUrl('widows_walk'),
	},
	{
		connection: [ 'top', 'bottom' ],
		floor:      [ 0, 1, 2 ],
		name:       'wine_cellar',
		img:        imgUrl('wine_cellar'),
	},
];
