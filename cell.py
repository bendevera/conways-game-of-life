

class Cell:
    def __init__(self, alive=False):
        self.alive = alive 
    
    def change_alive():
        if self.alive:
            self.alive = False 
        else:
            self.alive = True 
    
    def __str__(self):
        return str(self.alive)
    
    def __repr__(self):
        return self.__str__()