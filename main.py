import random

class BeautyContest:
    """
    Implementation of the Beauty Contest game from Alice in Borderland.
    
    The game involves players choosing numbers between 0-100. The winning number
    is calculated by taking the average of all numbers and multiplying it by a factor.
    Players whose numbers are furthest from the target lose points and are eliminated
    when reaching -10 points.
    """
    
    base_factor = 0.8  # Multiplier used to calculate target number
    players = {1:0,    # Dictionary of player IDs and their scores
              2:0,
              3:0,
              4:0,
              5:0}
    
    def calculate_chosen_numbers(self, player_numbers: dict[int, int]):
        """
        Calculate the average of all chosen numbers and the target number.
        
        Args:
            player_numbers (dict[int, int]): Dictionary of player IDs and their chosen numbers
            
        Returns:
            tuple[float, float]: (average of all numbers, target number after applying base_factor)
        """
        total = 0
        for key, value in player_numbers.items():
            total += value
            
        average = total / len(self.players)
        return average, average * self.base_factor
    
    def apply_results(self, calculated_result: float, player_numbers: dict[int, int]):
        """
        Determine the winner(s) of the round and update player scores.
        
        Args:
            calculated_result (float): The target number players are trying to get closest to
            player_numbers (dict[int, int]): Dictionary of player IDs and their chosen numbers
            
        Returns:
            set[int]: Set of winning player IDs for this round
        """
        closest_num = 1000
        closest_player = set()
        
        for idx, (key, value) in enumerate(player_numbers.items()):
            difference = self.calculateDifference(calculated_result, value)
            print(f"Player {key} has a difference of {difference}")
            
            if difference < closest_num:
                closest_player.clear()
                closest_player.add(key)
                closest_num = difference
            elif difference == closest_num:
                closest_player.add(key)
        
        # Penalize losing players
        for key, value in self.players.items():
            if key not in closest_player:
                self.players[key] -= 1
        return closest_player
    
    def calculateDifference(self, calculated_number: float, player_number: int) -> float:
        """
        Calculate the absolute difference between player's number and target number.
        
        Args:
            calculated_number (float): Target number
            player_number (int): Player's chosen number
            
        Returns:
            float: Absolute difference between the numbers
        """
        if player_number > calculated_number:
            return player_number - calculated_number
        elif calculated_number > player_number:
            return calculated_number - player_number
        return 0
    
    def eliminate_players(self):
        """
        Remove players who have reached -10 points or lower.
        """
        players_to_eliminate = set()
        for key, value in self.players.items():
            if value <= -10:
                players_to_eliminate.add(key)
        
        for player in players_to_eliminate:
            self.players.pop(player)
    
    def generate_numbers(self):
        """
        Generate random numbers between 0-100 for each remaining player.
        
        Returns:
            dict[int, int]: Dictionary mapping player IDs to their chosen numbers
        """
        chosen_numbers = {}
        for player in self.players.keys():
            number = random.randint(0,100)
            chosen_numbers[player] = number
        
        return chosen_numbers
    
    def play(self):
        """
        Main game loop that runs until only one player remains.
        Handles round progression, displays game state, and determines the winner.
        """
        iteration = 1
        while len(self.players) > 1:
            print(f"Welcome to round {iteration} of beauty contest. The players chose the following numbers:")
            chosen_numbers = self.generate_numbers()
            for key, value in chosen_numbers.items():
                print(f"\tPlayer {key} : {value}")
            
            ave, calculaton = self.calculate_chosen_numbers(chosen_numbers)
            print(f"The Average is {ave}. The calculated number is {calculaton}")
            winner = self.apply_results(calculaton, chosen_numbers)
            for player in winner:
                print(f"The winner for this round is player {player}")
            
            print("Current Player Scores: ")
            for player, points in self.players.items():
                print(f"\tPlayer {player} : {points} Points")
            
            print("=========================================End of Round===========================================")
            
            self.eliminate_players()
            iteration += 1
        
        game_winner = next(iter(self.players))
        print(f"The winner is Player {game_winner}")
        print("Thanks for playing beauty contest")


if __name__ == "__main__":
    game = BeautyContest()
    game.play()
    print("Game Finished")