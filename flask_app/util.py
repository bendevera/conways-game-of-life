def get_blank_grid(height, width):
    cells = [[False for col in range(width)] for row in range(height)]
    return cells

def get_new_cells(cells):
    height = len(cells)
    width = len(cells[0])
    new_cells = []
    for row in range(height):
        curr_row = []
        for col in range(width):
            old_cell = cells[row][col]
            new_cell = None
            if old_cell:
                live_neighbor_count = get_live_neigbor_count(cells, height, width, row, col)
                if live_neighbor_count not in [2, 3]:
                    new_cell = False
                else:
                    new_cell = True
            else:
                live_neighbor_count = get_live_neigbor_count(cells, height, width, row, col)
                if live_neighbor_count == 3:
                    new_cell = True
                else:
                    new_cell = False
            curr_row.append(new_cell)
        new_cells.append(curr_row) 
    return new_cells

def get_live_neigbor_count(cells, height, width, row, col):
    live_neighbor_count = 0
    start = (row-1, col-1)
    for i in range(row-1, row+2):
        for j in range(col-1, col+2):
            if i >= 0 and i < height and j >= 0 and j < width:
                if i != row or j != col:
                    if cells[i][j]:
                        live_neighbor_count += 1
    return live_neighbor_count

if __name__ == "__main__":
    working = True
    test = [[False]*3, [True]*3, [False]*3]
    test_result = get_new_cells(test)
    true_row = [False, True, False]
    true_result = [true_row, true_row, true_row]
    if true_result != test_result:
        working = False
    another_test = get_new_cells(test_result)
    if another_test != test:
        working = False
    if working:
        print("Working.")
    else:
        print(test_result)
        print(true_result)
        print("Not working.")
    get_blank_grid(3, 3)