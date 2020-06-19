from cell import Cell 
import time


class Grid:
    def __init__(self, width, height, live_cells=[]):
        self.cells = []
        self.width = width
        self.height = height
        for row in range(height):
            curr_row = []
            for col in range(width):
                alive = False
                if (row, col) in live_cells:
                    alive = True
                curr_cell = Cell(alive)
                curr_row.append(curr_cell)
            self.cells.append(curr_row)
        
        cycle_count = 1
        while True:
            print(f"Cycle {cycle_count}")
            self.print_board()
            new_cells = self.get_new_cells()
            self.cells = new_cells
            cycle_count += 1
            time.sleep(2)
    
    def get_new_cells(self):
        new_cells = []
        for row in range(self.height):
            curr_row = []
            for col in range(self.width):
                old_cell = self.cells[row][col]
                new_cell = None
                if old_cell.alive:
                    live_neighbor_count = self.get_live_neigbor_count(row, col)
                    if live_neighbor_count not in [2, 3]:
                        # old_cell.alive = False
                        new_cell = Cell(False)
                    else:
                        new_cell = Cell(True)
                else:
                    live_neighbor_count = self.get_live_neigbor_count(row, col)
                    if live_neighbor_count == 3:
                        # old_cell.alive = True
                        new_cell = Cell(True)
                    else:
                        new_cell = Cell(False)
                curr_row.append(new_cell)
            new_cells.append(curr_row) 
        return new_cells
    
    def get_live_neigbor_count(self, row, col):
        live_neighbor_count = 0
        start = (row-1, col-1)
        for i in range(row-1, row+2):
            for j in range(col-1, col+2):
                if i >= 0 and i < self.height and j >= 0 and j < self.width:
                    if i != row or j != col:
                        if self.cells[i][j].alive:
                            live_neighbor_count += 1
        return live_neighbor_count
    
    def print_board(self):
        for row in self.cells:
            print(row)
        print()

if __name__ == "__main__":
    live_cells = [(4, 1), (4, 2), (4, 3), (3, 2), (3, 3), (3, 4)]
    grid = Grid(6, 6, live_cells=live_cells)
