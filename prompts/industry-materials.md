# Industry Materials

This prompt is for a copy paste tool for the industry matrials list that can be copied from the `Industry` display in game.

Some sample inputs:

Manufacturing

```text
Armor Command Burst I Blueprint	43547

Minerals
Item	Required	Available	Est. Unit price	typeID
Tritanium	8541	0	3.82	34
Isogen	999	0	184.21	37
Nocxium	504	0	688.68	38
Megacyte	198	0	2022.81	40

Planetary materials
Item	Required	Available	Est. Unit price	typeID
Synthetic Synapses	27	0	86470.32	2346
```

Copying

```text
Prototype Cloaking Device I Blueprint	13000

Items
Item	Required	Available	Est. Unit price	typeID
Data Sheets	60	0	154.93	3812
R.Db - Ishukone	3	0	1062.64	11463
R.Db - CreoDron	3	0	1279.66	11466
```

Researching ME

```text
Prototype Cloaking Device I Blueprint	13000

Items
Item	Required	Available	Est. Unit price	typeID
Reports	5	0	31.84	3814
R.Db - Ishukone	1	0	1062.64	11463
R.Db - CreoDron	1	0	1279.66	11466

Planetary materials
Item	Required	Available	Est. Unit price	typeID
Consumer Electronics	1	0	10142.37	9836
```

Researching TE

```text
Prototype Cloaking Device I Blueprint	13000

Items
Item	Required	Available	Est. Unit price	typeID
Reports	5	0	31.84	3814
R.Db - Ishukone	1	0	1062.64	11463
R.Db - CreoDron	1	0	1279.66	11466

Planetary materials
Item	Required	Available	Est. Unit price	typeID
Consumer Electronics	4	0	10142.37	9836
```

Invention

```text
Armor Command Burst I Blueprint	43547

Datacores
Item	Required	Available	Est. Unit price	typeID
Datacore - Molecular Engineering	6	0	93084.4	20415
Datacore - Nuclear Physics	6	0	90968.85	20423

Optional items
Item	Required	Available	Est. Unit price	typeID
No item selected
```

Manufacturing

```text
Armor Command Burst II Blueprint	43607

Components
Item	Required	Available	Est. Unit price	typeID
Nanoelectrical Microprocessor	79	0	44329.68	11539
Photon Microprocessor	40	0	34819.35	11541

Planetary materials
Item	Required	Available	Est. Unit price	typeID
Transmitter	118	0	12494.64	9840

Items
Item	Required	Available	Est. Unit price	typeID
R.A.M.- Electronics	10	0	686.91	11483
Armor Command Burst I	10	0	469558.08	42526

Minerals
Item	Required	Available	Est. Unit price	typeID
Morphite	49	0	17936.8	11399

Reaction materials
Item	Required	Available	Est. Unit price	typeID
Nanotransistors	324	0	3458.04	16681
Hypersynaptic Fibers	167	0	6037.57	16682
```

as output, i would like well formatted markdown

Using the first manufacturing example:

```text
## Manufacturing -  Armor Command Burst I

Blueprint
: Armor Command Burst I Blueprint 43547
Activity
: Manufacturing
Runs
: 10
Portion Size
: 1
Result
: Armor Command Burst I
Units
: 10

Minerals

| Item      | Required | Available | Est. Unit price | typeID |
| --------- | -------- | --------- | --------------- | ------ |
| Tritanium | 8541     | 0         | 3.82            | 34     |
| Isogen    | 999      | 0         | 184.21          | 37     |
| Nocxium   | 504      | 0         | 688.68          | 38     |
| Megacyte  | 198      | 0         | 2022.81         | 40     |

Planetary materials

| Item               | Required | Available | Est. Unit price | typeID |
| ------------------ | -------- | --------- | --------------- | ------ |
| Synthetic Synapses | 27       | 0         | 86470.32        | 2346   |


Multibuy

| Name               | Quantity |
| ------------------ | -------- |
| Tritanium          | 8541     |
| Isogen             | 999      |
| Nocxium            | 504      |
| Megacyte           | 198      |
| Synthetic Synapses | 27       |
```

Invention
```text
## Invention - Armor Command Burst I

Blueprint
: Armor Command Burst I Blueprint 43547
Activity
: Invention
Runs
: 3
Result
: Armor Command Burst II
ME
: 2
TE
: 4
Result Runs
: 10

Datacores

| Item                             | Required | Available | Est. Unit price | typeID |
| -------------------------------- | -------- | --------- | --------------- | ------ |
| Datacore - Molecular Engineering | 6        | 0         | 93084.4         | 20415  |
| Datacore - Nuclear Physics       | 6        | 0         | 90968.85        | 20423  |

Optional items

| Item | Required | Available | Est. Unit price | typeID |
| ---- | -------- | --------- | --------------- | ------ |
```
- Note that for manufacturing Runs and Portion Size will have to be input by the user. Portion size can default to 1.
- for invention, runs, me, te, and result runs will have to be input by the user. default values are me=2, te=4, result runs=10.
- for copies, the attributes are Runs, and Runs per copy.
- Me and TE research have no runs or results, only the materials lists.
- The result material name is the blueprint name, minus `Blueprint`
- The number at the end of the blueprint name is the blueprints type_id.
- The default invention result blueprint name is the original blueprint name with `II` inplace of `I`. But some blueprints invent to completely different names. include a user facing not to verify the invention result name.
