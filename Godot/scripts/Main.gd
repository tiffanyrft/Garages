extends Node2D

@onready var garage = $Garage
@onready var cars = [$Car1, $Car2, $Car3]

func _ready():
	for car in cars:
		car.connect("car_clicked", Callable(self, "_on_car_clicked"))


func _on_car_clicked(car):
	var success = garage.try_assign_car(car)
	if success:
		print("Voiture assignée au garage :", car.car_name)
	else:
		print("Garage plein !")
