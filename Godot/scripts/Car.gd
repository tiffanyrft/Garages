extends Area2D

signal car_clicked(car)
signal repair_finished(car)

@export var car_name = "Voiture"
@export var repairs = ["Frein", "Vidange", "Filtre", "Batterie", "Amortisseurs", "Embrayage", "Pneus", "Refroidissement"]
@export var repair_duration = 3.0  # durée de chaque réparation en secondes

var current_repair = 0
var repair_progress = 0.0
var is_repairing = false
var finished = false

func _on_Car_input_event(_viewport, event, _shape_idx):
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		print("Voiture cliquée :", car_name)
		emit_signal("car_clicked", self)

func start_repair():
	if is_repairing or finished:
		return
	is_repairing = true
	current_repair = 0
	repair_progress = 0.0

func _process(delta):
	if is_repairing and current_repair < repairs.size():
		repair_progress += delta
		if repair_progress >= repair_duration:
			repair_progress = 0
			current_repair += 1
			print(car_name, "réparation terminée :", repairs[current_repair-1])
			if current_repair >= repairs.size():
				is_repairing = false
				finished = true
				emit_signal("repair_finished", self)
