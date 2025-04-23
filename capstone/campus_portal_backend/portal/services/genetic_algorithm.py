import random
from collections import defaultdict
from datetime import datetime, time, timedelta

POPULATION_SIZE = 50
GENERATIONS = 100
MUTATION_RATE = 0.1

LUNCH_START = time(13, 0)
LUNCH_END = time(13, 50)

def generate_timetable(teachers, courses, rooms, timeslots, constraints):
    max_hours = constraints.get("max_hours_per_day", 5)

    valid_timeslot_map = {"Lab": [], "Theatre": []}
    for idx, ts in enumerate(timeslots):
        start_str, end_str = ts["slot"].split(" - ")
        start = datetime.strptime(start_str.strip(), "%H:%M").time()
        end = datetime.strptime(end_str.strip(), "%H:%M").time()
        duration = (datetime.combine(datetime.today(), end) - datetime.combine(datetime.today(), start)).seconds // 60

        if (LUNCH_START <= start < LUNCH_END) or (LUNCH_START < end <= LUNCH_END):
            continue

        if duration >= 95:
            valid_timeslot_map["Lab"].append(idx)
        elif duration <= 55:
            valid_timeslot_map["Theatre"].append(idx)

    population = [
        create_random_timetable(courses, rooms, valid_timeslot_map, timeslots)
        for _ in range(POPULATION_SIZE)
    ]

    for _ in range(GENERATIONS):
        fitness_scores = [
            fitness(ind, courses, teachers, rooms, timeslots, max_hours, valid_timeslot_map)
            for ind in population
        ]
        next_gen = [population[fitness_scores.index(max(fitness_scores))]]

        while len(next_gen) < POPULATION_SIZE:
            p1 = select(population, fitness_scores)
            p2 = select(population, fitness_scores)
            child = crossover(p1, p2)
            mutate(child, courses, rooms, valid_timeslot_map, timeslots)
            next_gen.append(child)

        population = next_gen

    best = max(population, key=lambda ind: fitness(ind, courses, teachers, rooms, timeslots, max_hours, valid_timeslot_map))
    return format_result(best, courses, teachers, rooms, timeslots)

def create_random_timetable(courses, rooms, valid_timeslot_map, timeslots):
    timetable = {}
    for course in courses:
        assigned_room = random.choice(rooms)
        valid_ts = valid_timeslot_map.get(assigned_room["type"], []) or list(range(len(timeslots)))
        selected_ts = random.choice(valid_ts)
        selected_timeslot = timeslots[selected_ts]
        timetable[course["id"]] = {
            "room_id": assigned_room["id"],
            "timeslot_id": selected_ts,
            "timeslot_day": selected_timeslot["day"],
            "timeslot_slot": selected_timeslot["slot"],
        }
    return timetable

def fitness(timetable, courses, teachers, rooms, timeslots, max_hours, valid_timeslot_map):
    score = 1000
    teacher_day_hours = defaultdict(lambda: defaultdict(int))
    teacher_schedule = defaultdict(lambda: defaultdict(list))
    room_usage = defaultdict(set)
    room_map = {room["id"]: room for room in rooms}

    for course in courses:
        entry = timetable.get(course["id"])
        teacher_id = course.get("teacher_id")

        if not entry or teacher_id is None:
            score -= 50
            continue

        timeslot = timeslots[entry["timeslot_id"]]
        room = room_map[entry["room_id"]]
        day = timeslot["day"]
        time_range = timeslot["slot"]
        slot_key = f"{day}-{time_range}"

        if slot_key in room_usage[room["id"]]:
            score -= 20
        else:
            room_usage[room["id"]].add(slot_key)

        if entry["timeslot_id"] not in valid_timeslot_map.get(room["type"], []):
            score -= 25

        teacher_day_hours[teacher_id][day] += 1
        if teacher_day_hours[teacher_id][day] > max_hours:
            score -= 10

        start_str, end_str = time_range.split(" - ")
        start = datetime.strptime(start_str.strip(), "%H:%M").time()
        end = datetime.strptime(end_str.strip(), "%H:%M").time()
        teacher_schedule[teacher_id][day].append((start, end))

    for schedule in teacher_schedule.values():
        for times in schedule.values():
            sorted_times = sorted(times)
            for i in range(len(sorted_times) - 1):
                end_current = datetime.combine(datetime.today(), sorted_times[i][1])
                start_next = datetime.combine(datetime.today(), sorted_times[i + 1][0])
                if (start_next - end_current) <= timedelta(minutes=10):
                    score -= 20

    return score

def select(population, scores):
    total = sum(scores)
    if total <= 0:
        return random.choice(population)
    return random.choices(population, weights=[s / total for s in scores], k=1)[0]

def crossover(p1, p2):
    return {k: random.choice([p1.get(k), p2.get(k)]) for k in p1.keys()}

def mutate(timetable, courses, rooms, valid_timeslot_map, timeslots):
    room_map = {room["id"]: room for room in rooms}
    for course in courses:
        cid = course["id"]
        if cid not in timetable or random.random() >= MUTATION_RATE:
            continue
        room = room_map[timetable[cid]["room_id"]]
        valid_ts = valid_timeslot_map.get(room["type"], []) or list(range(len(timeslots)))
        timetable[cid]["timeslot_id"] = random.choice(valid_ts)

def format_result(timetable, courses, teachers, rooms, timeslots):
    teacher_map = {t["id"]: f"{t['first_name']} {t['last_name']}" for t in teachers}
    room_map = {r["id"]: r["name"] for r in rooms}
    result = []

    for course in courses:
        cid = course["id"]
        entry = timetable.get(cid)
        if not entry:
            continue
        slot = timeslots[entry["timeslot_id"]]
        result.append({
            "subject": course["name"],
            "teacher": teacher_map.get(course.get("teacher_id"), "Unknown"),
            "day": slot["day"],
            "time": slot["slot"],
            "room": room_map.get(entry["room_id"], "Unknown"),
        })

    return result