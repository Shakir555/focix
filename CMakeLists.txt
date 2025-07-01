cmake_minimum_required(VERSION 3.10)
project(Focix)

set(CMAKE_CXX_STANDARD 17)

add_executable(Focix
    main.cpp
    imgui/imgui.cpp
    imgui/imgui_demo.cpp
    imgui/imgui_draw.cpp
    imgui/imgui_tables.cpp
    imgui/imgui_widgets.cpp
    imgui/backends/imgui_impl_glfw.cpp
    imgui/backends/imgui_impl_opengl3.cpp
)

target_include_directories(Focix PRIVATE
    imgui
    imgui/backends
)

target_link_libraries(Focix PRIVATE glfw GL)
