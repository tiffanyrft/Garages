extends Node2D

@onready var slot1 = $RepairSlot1
@onready var slot2 = $RepairSlot2
@onready var waiting_marker = $WaitingSlot

var slot1_car = null
var slot2_car = null
var waiting_car = null

func try_assign_car(car):
	if slot1_car == null:
		slot1_car = car
		move_car_to(car, slot1.global_position)
		car.start_repair()
		car.repair_finished.connect(_on_car_finished)
		return true
	if slot2_car == null:
		slot2_car = car
		move_car_to(car, slot2.global_position)
		car.start_repair()
		car.repair_finished.connect(_on_car_finished)
		return true
	print("❌ Les 2 slots sont occupés")
	return false

func _on_car_finished(car):
	print("✔ Réparation finie :", car.car_name)
	if waiting_car != null:
		print("⏳ Slot d'attente déjà occupé")
		return
	if slot1_car == car:
		slot1_car = null
	elif slot2_car == car:
		slot2_car = null
	waiting_car = car
	move_car_to(car, waiting_marker.global_position)

func release_waiting_car():
	if waiting_car == null:
		return
	print("💰 Paiement reçu, voiture libérée :", waiting_car.car_name)
	waiting_car.queue_free()
	waiting_car = null

func move_car_to(car, target_pos):
	car.global_position = target_pos
