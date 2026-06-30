def main():
    import json
    import os
    import shutil

    static_src = 'src/static'                 # has index.html, css, js, etc.
    data_candidates = [
        'data/hackathons.json',               # produced by the scraper step
        '../scraper_flask/data/hackathons.json'
    ]

    build_dir = 'build'
    data_dir  = os.path.join(build_dir, 'data')

    # fresh build
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    os.makedirs(build_dir, exist_ok=True)

    # copy static assets so index.html ends up at build/index.html
    shutil.copytree(static_src, build_dir, dirs_exist_ok=True)

    # copy data
    os.makedirs(data_dir, exist_ok=True)
    for data_src in data_candidates:
        try:
            with open(data_src, 'r', encoding='utf-8') as f:
                data = json.load(f)
            with open(os.path.join(data_dir, 'hackathons.json'), 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            break
        except (FileNotFoundError, json.JSONDecodeError):
            continue
    else:
        raise FileNotFoundError('No valid hackathons.json found for static build')

    print("Build completed successfully.")

if __name__ == '__main__':
    main()
