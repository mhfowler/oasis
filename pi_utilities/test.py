import os


if __name__ == '__main__':
    log_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../log'))
    print log_dir
    out_file_path = os.path.join(log_dir, 'simple_python.log')
    with open(out_file_path, 'w') as out_file:
        out_file.write(out_file_path)