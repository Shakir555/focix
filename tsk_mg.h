#ifndef TSK_MG
#define TSK_MG

#include <vector>
#include <string>

class TaskMG 
{
public:
    void sideBar();
    void taskBoard();
    void addTaskModal();

private:
    struct Task
    {
        std::string title;
        std::string desc;
        std::string status;
    };

    std::vector<Task> tasks;

    bool show_modal = false;
    char title[64] = "";
    char desc[256] = "";
    int status_idx = 0;
};

#endif