export const DEMO_SCENARIOS = [
  {
    id: "burn",
    title: "Minor Thermal Burn",
    icon: "🩹",
    category: "medical",
    prompt: "I accidentally spilled hot tea on my forearm in the campus cafeteria. Skin is red and stinging with slight blistering.",
    guidance: {
      situation: "Minor Second-Degree Thermal Burn",
      category: "medical",
      severity: "low",
      confidence: 0.95,
      summary: "Superficial thermal injury caused by hot liquid contact. Localized erythema and stinging pain without deep tissue destruction.",
      immediate_actions: [
        "1. Cool the burn immediately under gentle, clean running water for at least 10 to 20 minutes.",
        "2. Carefully remove tight jewelry, watches, or clothing near the area before swelling starts.",
        "3. Cover loosely with a clean, sterile, non-adherent dressing or clean plastic wrap.",
        "4. Elevate the forearm if possible to minimize throbbing and fluid accumulation."
      ],
      avoid: [
        "Do NOT apply ice, iced water, or freezing compresses directly onto the burn.",
        "Do NOT puncture, pop, or scratch any blisters that form.",
        "Do NOT apply butter, toothpaste, oil, or unverified household ointments."
      ],
      when_to_seek_help: [
        "Seek medical evaluation if the burn is larger than the palm of the person's hand.",
        "Visit Campus Medical Center if the burn affects the face, hands, groin, or major joints.",
        "Consult a doctor if signs of infection emerge (increasing redness, pus, or fever)."
      ],
      emergency_required: false,
      emergency_reason: "",
      is_demo: true
    }
  },
  {
    id: "cut",
    title: "Small Kitchen/Lab Cut",
    icon: "🩸",
    category: "medical",
    prompt: "Slipped while slicing fruit in the dorm pantry. Small cut on index finger, bleeding steadily but not spurting.",
    guidance: {
      situation: "Minor Laceration / Superficial Incision",
      category: "medical",
      severity: "low",
      confidence: 0.92,
      summary: "Clean superficial skin cut on digit with mild capillary bleeding. Surrounding circulation appears intact.",
      immediate_actions: [
        "1. Apply direct, gentle pressure using a clean gauze or lint-free cloth for 5 continuous minutes without lifting.",
        "2. Elevate the hand above heart level while applying pressure to slow blood flow.",
        "3. Once bleeding stops, rinse the wound under clean tap water and pat dry gently.",
        "4. Apply a sterile adhesive bandage (Band-Aid) firmly across the edges to protect against contamination."
      ],
      avoid: [
        "Do NOT apply harsh chemical antiseptics like pure bleach or hydrogen peroxide repeatedly as they impair tissue healing.",
        "Do NOT remove deeply embedded glass or foreign objects yourself.",
        "Do NOT touch the wound with unwashed hands."
      ],
      when_to_seek_help: [
        "Seek medical care if bleeding does not stop after 10-15 minutes of direct continuous pressure.",
        "Consult Campus Medical Center if the cut edges gape apart (may require stitches or butterfly closures).",
        "Verify tetanus immunization status if cut by a contaminated or rusty object."
      ],
      emergency_required: false,
      emergency_reason: "",
      is_demo: true
    }
  },
  {
    id: "faint",
    title: "Person Feeling Faint / Syncope",
    icon: "🫁",
    category: "medical",
    prompt: "A student in the lecture hall suddenly turned pale, felt dizzy, and slumped into their chair, nearly fainting.",
    guidance: {
      situation: "Near-Syncope / Vasovagal Presyncope",
      category: "medical",
      severity: "medium",
      confidence: 0.90,
      summary: "Transient cerebral hypoperfusion causing dizziness, pallor, and near loss of consciousness in a seated individual.",
      immediate_actions: [
        "1. Help the person lie flat on their back immediately; elevate their legs approximately 12 inches (30 cm).",
        "2. Loosen tight collars, ties, belts, or restrictive clothing to aid airway circulation.",
        "3. Ensure fresh air circulation by opening windows or asking bystanders to give space.",
        "4. If fully conscious and alert, offer small sips of cool water or electrolyte drink."
      ],
      avoid: [
        "Do NOT force the person to stand up or walk prematurely.",
        "Do NOT give food or drink while they are unconscious, drowsy, or nauseated.",
        "Do NOT splash cold water on their face or slap their cheeks."
      ],
      when_to_seek_help: [
        "Call emergency services (112) immediately if the person remains unresponsive for more than 60 seconds.",
        "Seek urgent medical evaluation if fainting is accompanied by chest pain, shortness of breath, or seizure activity.",
        "Report to Campus Medical Center if they hit their head during the fall."
      ],
      emergency_required: false,
      emergency_reason: "",
      is_demo: true
    }
  },
  {
    id: "electrical",
    title: "Electrical Hazard / Sparking Wire",
    icon: "⚡",
    category: "electrical",
    prompt: "A frayed power cord in the computer lab is sparking near a puddle of water, someone almost touched it.",
    guidance: {
      situation: "Live Electrical Hazard with Fluid Contact Risk",
      category: "electrical",
      severity: "high",
      confidence: 0.98,
      summary: "High-risk electrocution and electrical fire hazard from damaged energized cabling in proximity to conductive moisture.",
      immediate_actions: [
        "1. DO NOT touch the wire, cord, or puddle under any circumstances.",
        "2. Keep everyone at least 15 feet away from the wet area and cord.",
        "3. Turn off the lab main circuit breaker ONLY if the switchboard is in a dry, safe location away from the hazard.",
        "4. Call Campus Security and Facilities Emergency Services immediately to isolate the circuit."
      ],
      avoid: [
        "Do NOT attempt to unplug the cord while standing on wet flooring or using bare hands.",
        "Do NOT use water or liquid extinguishers if a flame breaks out.",
        "Do NOT touch anyone who is in active contact with a live electrical source; use non-conductive dry wood or plastic if emergency dislodging is needed."
      ],
      when_to_seek_help: [
        "Notify Campus Facilities & Security immediately for electrical isolation.",
        "Call 112 immediately if anyone received an electric shock, even if they appear conscious and uninjured (risk of cardiac arrhythmias)."
      ],
      emergency_required: true,
      emergency_reason: "Direct danger of lethal electrocution or electrical fire in a shared public space.",
      is_demo: true
    }
  },
  {
    id: "fire",
    title: "Smoke / Chemistry Lab Fire",
    icon: "🔥",
    category: "fire",
    prompt: "Dense acrid smoke and flames visible from a trash bin and chemical bench in the 2nd floor science wing.",
    guidance: {
      situation: "Active Building Smoke and Chemical Fire Hazard",
      category: "fire",
      severity: "critical",
      confidence: 0.99,
      summary: "Life-threatening structural fire hazard with potential toxic combustion byproducts in an academic facility.",
      immediate_actions: [
        "1. Pull the nearest red Fire Alarm pull station immediately to alert the entire building.",
        "2. Evacuate immediately via the nearest marked emergency exit staircase—DO NOT use elevators.",
        "3. Stay low below the smoke line where the air is cooler and cleaner.",
        "4. Close doors behind you as you exit to contain smoke spread, and gather at the designated outdoor assembly point.",
        "5. Dial 112 / Campus Security once safely outside the building."
      ],
      avoid: [
        "Do NOT re-enter the building for personal belongings, laptops, or textbooks.",
        "Do NOT use elevators under any circumstances during a fire evacuation.",
        "Do NOT attempt to fight a chemical or spreading fire with an improper extinguisher."
      ],
      when_to_seek_help: [
        "Call Emergency Services (112) and Campus Security immediately.",
        "Direct anyone with smoke inhalation, coughing, or burns to paramedics at the assembly point."
      ],
      emergency_required: true,
      emergency_reason: "Immediate, critical threat to life and structural safety from fire and toxic fumes.",
      is_demo: true
    }
  }
];
