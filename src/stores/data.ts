export const data = {
	shapes: [
		{
			'@id': 'jsld:PersonShape',
			'@type': 'sh:NodeShape',
			targetClass: 'jsld:Person',
			property: [
				{
					'@id': 'jsld:GivenNamePropertyShape',
					'@type': 'sh:PropertyShape',
					name: 'given name',
					path: 'jsld:givenName',
					datatype: 'xsd:string'
				},
				{
					'@id': 'jsld:BirthDatePropertyShape',
					'@type': 'sh:PropertyShape',
					path: 'jsld:birthDate',
					maxCount: 1
				},
				{
					'@id': 'jsld:GenderPropertyShape',
					'@type': 'sh:PropertyShape',
					path: 'jsld:gender'
				},
				{
					'@id': 'jsld:AddressPropertyShape',
					'@type': 'sh:PropertyShape',
					path: 'jsld:address'
				}
			]
		},
		{
			'@id': 'jsld:AddressShape',
			'@type': 'sh:NodeShape',
			targetClass: 'jsld:Address',
			property: []
		}
	],
	properties: [
		{
			'@id': 'jsld:GivenNamePropertyShape',
			'@type': 'sh:PropertyShape',
			name: 'given name',
			path: 'jsld:givenName',
			datatype: 'xsd:string'
		},
		{
			'@id': 'jsld:BirthDatePropertyShape',
			'@type': 'sh:PropertyShape',
			path: 'jsld:birthDate',
			maxCount: 1
		},
		{
			'@id': 'jsld:GenderPropertyShape',
			'@type': 'sh:PropertyShape',
			path: 'jsld:gender'
		},
		{
			'@id': 'jsld:AddressPropertyShape',
			'@type': 'sh:PropertyShape',
			path: 'jsld:address',
			node: 'jsld:AddressShape'
		}
	]
};