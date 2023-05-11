local M = {}

local is_windows
if jit ~= nil then
    is_windows = jit.os == "Windows"
else
    is_windows = package.config:sub(1, 1) == "\\"
end

local join_paths = function(...)
    local separator
    if is_windows then
        separator = "\\"
    else
        separator = "/"
    end
    return table.concat({ ... }, separator)
end

function M.setup(arg)
    local parser_config = require('nvim-treesitter.parsers').get_parser_configs()
    parser_config.curse = {
        install_info = {
            url = arg['local'] and join_paths(
                vim.fn.stdpath('data'),
                'site',
                'pack',
                'packer',
                'start',
                'tree-sitter-curse',
            ) or 'https://github.com/William103/tree-sitter-curse',
            files = { 'src/parser.c' },
            branch = 'main',
        },
        maintainers = { '@William103', '@QnnOkabayashi' }
    }
    local ok, ft = pcall(require, 'filetype')
    if ok then
        ft.setup({
            overrides = {
                extensions = {
                    curse = 'curse',
                },
            },
        })
    end
end

return M
