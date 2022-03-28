from distutils.dir_util import copy_tree
from os                 import getcwd, listdir, chmod, system, unlink
from stat               import S_IWRITE

#get the current working directory
cwd = getcwd()

#delete the old files from .\OortStudiosWebsiteBuild
def remove_read_only(path):
    # path contains the path of the file that couldn't be removed
    # let's just assume that it's read-only and unlink it.
    chmod(path, S_IWRITE)
    unlink(path)

print("Deleting files...")
filelist = [ f for f in listdir(cwd + "\\OortStudiosWebsiteBuild") if not (f.endswith(".py") or f.endswith(".git")) ]
for f in filelist:
    print(f"{cwd}\\OortStudiosWebsiteBuild\\{f}")
    system(f"del {cwd}\\OortStudiosWebsiteBuild\\{f}")


#move the files from .\OortStudiosWebsite\build\web\ to .\OortStudiosWebsiteBuild\
print("Copying new files...")
copy_path = cwd + "\\OortStudiosWebsite\\build\\web\\"
copy_dest = cwd + "\\OortStudiosWebsiteBuild"
copy_tree(copy_path, copy_dest)

#finished processing
print("Finished!")