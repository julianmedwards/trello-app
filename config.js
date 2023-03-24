module.exports = {
    defaultBoardData: {
        boardName: 'Default Board',
        lanes: [
            {
                laneName: 'Lane 1',
                cards: [
                    {
                        cardName: 'L1 Card 1',
                        cardDescr: 'info',
                        sequence: 0,
                    },
                    {
                        cardName: 'L1 Card 2',
                        cardDescr: '',
                        sequence: 1,
                    },
                    {
                        cardName: 'L1 Card 3',
                        cardDescr: 'a description',
                        sequence: 2,
                    },
                ],
                sequence: 0,
            },
            {
                laneName: 'Lane 2',
                cards: [
                    {
                        cardName: 'L2 Card 1',
                        cardDescr: 'Description',
                        sequence: 0,
                    },
                ],
                sequence: 1,
            },
            {
                laneName: 'Lane 3',
                cards: [],
                sequence: 2,
            },
        ],
    },
}
