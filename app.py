from flask import Flask, render_template, jsonify, request

from physics import (
    schwarzschild_radius,
    kerr_event_horizon_radius,
    photon_sphere_radius
)


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/calculate")
def calculate():

    mass = float(request.args.get("mass", 1))
    spin = float(request.args.get("spin", 0))

    radius = kerr_event_horizon_radius(mass, spin)
    photon_radius = photon_sphere_radius(mass, spin)

    return jsonify({
        "mass": mass,
        "spin": spin,
        "event_horizon_radius": radius,
        "photon_sphere_radius": photon_radius
    })


if __name__ == "__main__":
    app.run(debug=True)