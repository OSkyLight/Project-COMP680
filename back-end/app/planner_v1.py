from typing import List, Dict, Any, Tuple, Set


# Time helpers
def hhmm_to_minutes(t: str) -> int:
    h, m = t.strip().split(":")
    return int(h) * 60 + int(m)


def overlaps(a_start: int, a_end: int, b_start: int, b_end: int) -> bool:
    return a_start < b_end and b_start < a_end


def split_days(day_str: str) -> List[str]:
    if not day_str:
        return []
    s = day_str.strip()
    if "/" in s:
        return [d.strip() for d in s.split("/") if d.strip()]
    return [s]


def normalize_name(name: str) -> str:
    return (name or "").strip().lower()


def is_lab(code: str) -> bool:
    return (code or "").strip().endswith("L")


def base_code(code: str) -> str:
    c = (code or "").strip()
    return c[:-1] if c.endswith("L") else c


# Free time filter
def build_freetime_map(freetimes) -> Dict[str, List[Tuple[int, int]]]:
    result: Dict[str, List[Tuple[int, int]]] = {}
    for ft in freetimes:
        day = (ft.day or "").strip()
        start = hhmm_to_minutes(ft.start_time)
        end = hhmm_to_minutes(ft.end_time)
        if not day:
            continue
        result.setdefault(day, []).append((start, end))
    return result


def course_fits_freetime(course, freetime_map) -> bool:
    """
    Course fits if for every meeting day, the (start,end) is within at least one free-time block.
    """
    days = split_days(getattr(course, "day", None))
    if not days:
        return False

    start = hhmm_to_minutes(course.start_time)
    end = hhmm_to_minutes(course.end_time)

    for d in days:
        allowed_blocks = freetime_map.get(d, [])
        ok = False
        for fs, fe in allowed_blocks:
            if start >= fs and end <= fe:
                ok = True
                break
        if not ok:
            return False
    return True

# Strict Pairing Logic (Mode B)
def build_options_strict_pairing(offerings: List[Any], gap_min: int = 10, gap_max: int = 20) -> List[Dict[str, Any]]:
    """
    Returns options where each option is:
      {"courses":[Course,...], "units":int}

    Strict rule:
    - If a lab exists for a base code, the lecture MUST be paired with a lab
      that matches:
        same day string, same instructor, and lab starts 10-20 minutes after lecture ends.
    - If no lab exists for that base code, lecture can be single.
    """
    lectures = [c for c in offerings if not is_lab(c.course_code)]
    labs = [c for c in offerings if is_lab(c.course_code)]

    labs_by_base: Dict[str, List[Any]] = {}
    for lab in labs:
        labs_by_base.setdefault(base_code(lab.course_code), []).append(lab)

    options: List[Dict[str, Any]] = []

    for lec in lectures:
        b = base_code(lec.course_code)

        # No lab exists -> single is allowed
        if b not in labs_by_base:
            options.append({
                "courses": [lec],
                "units": int(lec.units),
            })
            continue

        # Lab exists -> strict pairing required
        for lab in labs_by_base[b]:
            if (lec.day or "").strip() != (lab.day or "").strip():
                continue

            if normalize_name(getattr(lec, "instructor", None)) != normalize_name(getattr(lab, "instructor", None)):
                continue

            gap = hhmm_to_minutes(lab.start_time) - hhmm_to_minutes(lec.end_time)
            if gap_min <= gap <= gap_max:
                options.append({
                    "courses": [lec, lab],
                    "units": int(lec.units) + int(lab.units),
                })

    return options

# Conflict Check
def _option_course_codes(opt: Dict[str, Any]) -> Set[str]:
    return {(getattr(c, "course_code", "") or "").strip() for c in opt.get("courses", [])}


def option_conflicts(option: Dict[str, Any], chosen_options: List[Dict[str, Any]]) -> bool:
    new_codes = _option_course_codes(option)
    for chosen in chosen_options:
        if new_codes.intersection(_option_course_codes(chosen)):
            return True
    for c in option["courses"]:
        c_days = split_days(c.day)
        c_start = hhmm_to_minutes(c.start_time)
        c_end = hhmm_to_minutes(c.end_time)

        for chosen in chosen_options:
            for cc in chosen["courses"]:
                common_days = set(c_days).intersection(split_days(cc.day))
                if not common_days:
                    continue

                b_start = hhmm_to_minutes(cc.start_time)
                b_end = hhmm_to_minutes(cc.end_time)

                if overlaps(c_start, c_end, b_start, b_end):
                    return True

    return False


# Generate Schedules (Backtracking)
def generate_schedules(options: List[Dict[str, Any]], target_units: int, max_options: int = 5) -> List[List[Dict[str, Any]]]:
    """
    DFS + backtracking to find schedules with total_units == target_units.
    """
    results: List[List[Dict[str, Any]]] = []

    def dfs(index: int, chosen: List[Dict[str, Any]], units: int):
        if len(results) >= max_options:
            return

        if units == target_units:
            results.append(list(chosen))
            return

        if units > target_units or index >= len(options):
            return

        # Skip
        dfs(index + 1, chosen, units)

        # Take
        opt = options[index]
        if units + opt["units"] <= target_units and not option_conflicts(opt, chosen):
            chosen.append(opt)
            dfs(index + 1, chosen, units + opt["units"])
            chosen.pop()

    dfs(0, [], 0)
    return results