from anylog import app

if __name__ == "__main__":
    app.config['DEBUG'] = False
    app.run(host='0.0.0.0', port=3334, debug=False)
