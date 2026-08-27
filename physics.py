import math

G = 6.67430e-11
c = 299792458
SOLAR_MASS = 1.989e30


def schwarzschild_radius(mass_solar):
    mass_kg = mass_solar * SOLAR_MASS

    radius_m = (2 * G * mass_kg) / (c ** 2)

    radius_km = radius_m / 1000

    return radius_km

def kerr_event_horizon_radius(mass_solar, spin):
    mass_kg = mass_solar * SOLAR_MASS

    gravitational_radius = (G * mass_kg) / (c ** 2)

    radius_m = gravitational_radius * (
        1 + (1 - spin ** 2) ** 0.5
    )

    radius_km = radius_m / 1000

    return radius_km

def photon_sphere_radius(mass_solar, spin):
    mass_kg = mass_solar * SOLAR_MASS

    gravitational_radius = (G * mass_kg) / (c ** 2)

    angle = (2 / 3) * math.acos(-spin)

    radius_m = 2 * gravitational_radius * (
        1 + math.cos(angle)
    )

    radius_km = radius_m / 1000

    return radius_km