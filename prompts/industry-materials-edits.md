# industry-materials-edits

This prmpt deals with edits to the industry-materials tool

I would like to add a number of inputs and changed outputs to the industry materials tool.

Added Inputs:
- A user inputed Time field for all activities. no default value, can be blank but should display warning if so.
- Add an ME and TE field to manufacturing jobs

Changed Outputs:
- Make the `Multibuy`  label a header, e.g. `### Multibuy`
- Just before the `### Multibuy` header, add `### Output`
- Move result and result quantity to the Output table from the general table
- Add an `ME` and `TE` field to the general table for manufacturing jobs.
- add `### Input` just after the general table
- add `### Detailed Multibuy`, `### Detailed Output`, `### Notes` at the end of each output


This text block contains several examples of the desired new output:
```text
## Manufacturing - Prototype Cloaking Device I

| Attribute    | Value                                       |
| ------------ | ------------------------------------------- |
| Blueprint    | Prototype Cloaking Device I Blueprint 13000 |
| Activity     | Manufacturing                               |
| ME           | 10                                          |
| TE           | 20                                          |
| Runs         | 10                                          |
| Portion Size | 1                                           |
| Time         |                                             |

### Input

Planetary materials

| Item                  | Required | Available | Est. Unit price | typeID |
| --------------------- | -------: | --------: | --------------: | -----: |
| Supercomputers        |       18 |         0 |       107409.92 |   2349 |
| Hermetic Membranes    |       27 |         0 |        112853.8 |   2361 |
| Transmitter           |       54 |         0 |        12494.64 |   9840 |
| Miniature Electronics |       54 |         0 |        12802.73 |   9842 |

Minerals

| Item      | Required | Available | Est. Unit price | typeID |
| --------- | -------: | --------: | --------------: | -----: |
| Tritanium |   146277 |         0 |            3.82 |     34 |
| Pyerite   |    57177 |         0 |           16.59 |     35 |
| Mexallon  |     7002 |         0 |           51.71 |     36 |
| Isogen    |     4140 |         0 |          184.21 |     37 |
| Nocxium   |     1539 |         0 |          688.68 |     38 |
| Zydrine   |     1206 |         0 |         1036.79 |     39 |
| Megacyte  |      306 |         0 |         2022.81 |     40 |
| Morphite  |       99 |         0 |         17936.8 |  11399 |

Items

| Item                | Required | Available | Est. Unit price | typeID |
| ------------------- | -------: | --------: | --------------: | -----: |
| R.A.M.- Electronics |       10 |         0 |          686.91 |  11483 |

### Output

| Name                        | Quantity |
| --------------------------- | -------: |
| Prototype Cloaking Device I |       10 |

### Multibuy

| Name                  | Quantity |
| --------------------- | -------: |
| Supercomputers        |       18 |
| Hermetic Membranes    |       27 |
| Transmitter           |       54 |
| Miniature Electronics |       54 |
| Tritanium             |   146277 |
| Pyerite               |    57177 |
| Mexallon              |     7002 |
| Isogen                |     4140 |
| Nocxium               |     1539 |
| Zydrine               |     1206 |
| Megacyte              |      306 |
| Morphite              |       99 |
| R.A.M.- Electronics   |       10 |

### Detailed Multibuy

### Detailed Output

### Notes

## Copying - Prototype Cloaking Device I

| Attribute     | Value                                       |
| ------------- | ------------------------------------------- |
| Blueprint     | Prototype Cloaking Device I Blueprint 13000 |
| Activity      | Copying                                     |
| Runs          | 1                                           |
| Runs per copy | 3                                           |
| Time          |                                             |

### Input

Items

| Item            | Required | Available | Est. Unit price | typeID |
| --------------- | -------: | --------: | --------------: | -----: |
| Data Sheets     |       60 |         0 |          154.93 |   3812 |
| R.Db - Ishukone |        3 |         0 |         1062.64 |  11463 |
| R.Db - CreoDron |        3 |         0 |         1279.66 |  11466 |

### Output

| Name                                  | Quantity |
| ------------------------------------- | -------: |
| Prototype Cloaking Device I Blueprint |          |

### Multibuy

| Name            | Quantity |
| --------------- | -------: |
| Data Sheets     |       60 |
| R.Db - Ishukone |        3 |
| R.Db - CreoDron |        3 |

### Detailed Multibuy

### Detailed Output

### Notes

## Invention - Prototype Cloaking Device I

| Attribute   | Value                                       |
| ----------- | ------------------------------------------- |
| Blueprint   | Prototype Cloaking Device I Blueprint 13000 |
| Activity    | Invention                                   |
| Runs        | 3                                           |
| ME          | 2                                           |
| TE          | 4                                           |
| Result Runs | 10                                          |
| Time        |                                             |

### Input

Datacores

| Item                        | Required | Available | Est. Unit price | typeID |
| --------------------------- | -------: | --------: | --------------: | -----: |
| Datacore - Quantum Physics  |        6 |         0 |        95819.04 |  20414 |
| Datacore - Graviton Physics |        6 |         0 |         98827.8 |  20419 |

Optional items

| Item | Required | Available | Est. Unit price | typeID |
| ---- | -------: | --------: | --------------: | -----: |

### Output

| Name                                    | Quantity |
| --------------------------------------- | -------: |
| Covert Ops Cloaking Device II Blueprint |          |

### Multibuy

| Name                        | Quantity |
| --------------------------- | -------: |
| Datacore - Quantum Physics  |        6 |
| Datacore - Graviton Physics |        6 |

### Detailed Multibuy

### Detailed Output

### Notes

## Invention - Prototype Cloaking Device I

| Attribute   | Value                                       |
| ----------- | ------------------------------------------- |
| Blueprint   | Prototype Cloaking Device I Blueprint 13000 |
| Activity    | Invention                                   |
| Runs        | 3                                           |
| ME          | 2                                           |
| TE          | 4                                           |
| Result Runs | 10                                          |
| Time        |                                             |

### Input

Datacores

| Item                        | Required | Available | Est. Unit price | typeID |
| --------------------------- | -------: | --------: | --------------: | -----: |
| Datacore - Quantum Physics  |        6 |         0 |        95819.04 |  20414 |
| Datacore - Graviton Physics |        6 |         0 |         98827.8 |  20419 |

Optional items

| Item | Required | Available | Est. Unit price | typeID |
| ---- | -------: | --------: | --------------: | -----: |

### Output

| Name                                  | Quantity |
| ------------------------------------- | -------: |
| Improved Cloaking Device II Blueprint |          |

### Multibuy

| Name                        | Quantity |
| --------------------------- | -------: |
| Datacore - Quantum Physics  |        6 |
| Datacore - Graviton Physics |        6 |

### Detailed Multibuy

### Detailed Output

### Notes

## Manufacturing - Covert Ops Cloaking Device II

| Attribute    | Value                                         |
| ------------ | --------------------------------------------- |
| Blueprint    | Covert Ops Cloaking Device II Blueprint 12105 |
| Activity     | Manufacturing                                 |
| ME           | 2                                             |
| TE           | 4                                             |
| Runs         | 10                                            |
| Portion Size | 1                                             |
| Time         |                                               |

### Input

Items

| Item                        | Required | Available | Est. Unit price | typeID |
| --------------------------- | -------: | --------: | --------------: | -----: |
| Prototype Cloaking Device I |       10 |         0 |      1821764.34 |  11370 |
| R.A.M.- Electronics         |       10 |         0 |          686.91 |  11483 |

Minerals

| Item     | Required | Available | Est. Unit price | typeID |
| -------- | -------: | --------: | --------------: | -----: |
| Morphite |      147 |         0 |         17936.8 |  11399 |

Planetary materials

| Item                  | Required | Available | Est. Unit price | typeID |
| --------------------- | -------: | --------: | --------------: | -----: |
| Transmitter           |      216 |         0 |        12494.64 |   9840 |
| Miniature Electronics |      216 |         0 |        12802.73 |   9842 |

Components

| Item                     | Required | Available | Est. Unit price | typeID |
| ------------------------ | -------: | --------: | --------------: | -----: |
| Photon Microprocessor    |      324 |         0 |        34819.35 |  11541 |
| Graviton Pulse Generator |      255 |         0 |        18890.67 |  11693 |

### Output

| Name                          | Quantity |
| ----------------------------- | -------: |
| Covert Ops Cloaking Device II |       10 |

### Multibuy

| Name                        | Quantity |
| --------------------------- | -------: |
| Prototype Cloaking Device I |       10 |
| R.A.M.- Electronics         |       10 |
| Morphite                    |      147 |
| Transmitter                 |      216 |
| Miniature Electronics       |      216 |
| Photon Microprocessor       |      324 |
| Graviton Pulse Generator    |      255 |

### Detailed Multibuy

### Detailed Output

### Notes

## Manufacturing - Photon Microprocessor

| Attribute    | Value                                 |
| ------------ | ------------------------------------- |
| Blueprint    | Photon Microprocessor Blueprint 17357 |
| Activity     | Manufacturing                         |
| ME           | 10                                    |
| TE           | 20                                    |
| Runs         | 324                                   |
| Portion Size | 1                                     |
| Time         |                                       |

### Input

Reaction materials

| Item                   | Required | Available | Est. Unit price | typeID |
| ---------------------- | -------: | --------: | --------------: | -----: |
| Crystalline Carbonide  |     4958 |         0 |           81.74 |  16670 |
| Phenolic Composites    |     1750 |         0 |          965.66 |  16680 |
| Nanotransistors        |      584 |         0 |         3458.04 |  16681 |
| Photonic Metamaterials |      584 |         0 |         8807.58 |  33359 |

### Output

| Name                  | Quantity |
| --------------------- | -------: |
| Photon Microprocessor |      324 |

### Multibuy

| Name                   | Quantity |
| ---------------------- | -------: |
| Crystalline Carbonide  |     4958 |
| Phenolic Composites    |     1750 |
| Nanotransistors        |      584 |
| Photonic Metamaterials |      584 |

### Detailed Multibuy

### Detailed Output

### Notes

## Manufacturing - Graviton Pulse Generator

| Attribute    | Value                                    |
| ------------ | ---------------------------------------- |
| Blueprint    | Graviton Pulse Generator Blueprint 17332 |
| Activity     | Manufacturing                            |
| ME           | 10                                       |
| TE           | 20                                       |
| Runs         | 255                                      |
| Portion Size | 1                                        |
| Time         |                                          |

### Input

Reaction materials

| Item                | Required | Available | Est. Unit price | typeID |
| ------------------- | -------: | --------: | --------------: | -----: |
| Titanium Carbide    |     5049 |         0 |           80.47 |  16671 |
| Phenolic Composites |     1607 |         0 |          965.66 |  16680 |
| Nanotransistors     |      459 |         0 |         3458.04 |  16681 |

### Output

| Name                     | Quantity |
| ------------------------ | -------: |
| Graviton Pulse Generator |      255 |

### Multibuy

| Name                | Quantity |
| ------------------- | -------: |
| Titanium Carbide    |     5049 |
| Phenolic Composites |     1607 |
| Nanotransistors     |      459 |

### Detailed Multibuy

### Detailed Output

### Notes

## Manufacturing - Improved Cloaking Device II

| Attribute    | Value                                       |
| ------------ | ------------------------------------------- |
| Blueprint    | Improved Cloaking Device II Blueprint 12104 |
| Activity     | Manufacturing                               |
| ME           | 2                                           |
| TE           | 4                                           |
| Runs         | 10                                          |
| Portion Size | 1                                           |
| Time         |                                             |

### Input

Items

| Item                        | Required | Available | Est. Unit price | typeID |
| --------------------------- | -------: | --------: | --------------: | -----: |
| Prototype Cloaking Device I |       10 |         0 |      1821764.34 |  11370 |
| R.A.M.- Electronics         |       10 |         0 |          686.91 |  11483 |

Components

| Item                     | Required | Available | Est. Unit price | typeID |
| ------------------------ | -------: | --------: | --------------: | -----: |
| Photon Microprocessor    |      147 |         0 |        34819.35 |  11541 |
| Graviton Pulse Generator |      147 |         0 |        18890.67 |  11693 |

### Output

| Name                        | Quantity |
| --------------------------- | -------: |
| Improved Cloaking Device II |       10 |

### Multibuy

| Name                        | Quantity |
| --------------------------- | -------: |
| Prototype Cloaking Device I |       10 |
| R.A.M.- Electronics         |       10 |
| Photon Microprocessor       |      147 |
| Graviton Pulse Generator    |      147 |

### Detailed Multibuy

### Detailed Output

### Notes

## Manufacturing - Photon Microprocessor

| Attribute    | Value                                 |
| ------------ | ------------------------------------- |
| Blueprint    | Photon Microprocessor Blueprint 17357 |
| Activity     | Manufacturing                         |
| ME           | 10                                    |
| TE           | 20                                    |
| Runs         | 147                                   |
| Portion Size | 1                                     |
| Time         |                                       |

### Input

Reaction materials

| Item                   | Required | Available | Est. Unit price | typeID |
| ---------------------- | -------: | --------: | --------------: | -----: |
| Crystalline Carbonide  |     2250 |         0 |           81.74 |  16670 |
| Phenolic Composites    |      794 |         0 |          965.66 |  16680 |
| Nanotransistors        |      265 |         0 |         3458.04 |  16681 |
| Photonic Metamaterials |      265 |         0 |         8807.58 |  33359 |

### Output

| Name                  | Quantity |
| --------------------- | -------: |
| Photon Microprocessor |      147 |

### Multibuy

| Name                   | Quantity |
| ---------------------- | -------: |
| Crystalline Carbonide  |     2250 |
| Phenolic Composites    |      794 |
| Nanotransistors        |      265 |
| Photonic Metamaterials |      265 |

### Detailed Multibuy

### Detailed Output

### Notes

## Manufacturing - Graviton Pulse Generator

| Attribute    | Value                                    |
| ------------ | ---------------------------------------- |
| Blueprint    | Graviton Pulse Generator Blueprint 17332 |
| Activity     | Manufacturing                            |
| ME           | 10                                       |
| TE           | 20                                       |
| Runs         | 147                                      |
| Portion Size | 1                                        |
| Time         |                                          |

### Input

Reaction materials

| Item                | Required | Available | Est. Unit price | typeID |
| ------------------- | -------: | --------: | --------------: | -----: |
| Titanium Carbide    |     2911 |         0 |           80.47 |  16671 |
| Phenolic Composites |      927 |         0 |          965.66 |  16680 |
| Nanotransistors     |      265 |         0 |         3458.04 |  16681 |

### Output

| Name                     | Quantity |
| ------------------------ | -------: |
| Graviton Pulse Generator |      147 |

### Multibuy

| Name                | Quantity |
| ------------------- | -------: |
| Titanium Carbide    |     2911 |
| Phenolic Composites |      927 |
| Nanotransistors     |      265 |

### Detailed Multibuy

### Detailed Output

### Notes
```