language en_US
:set number

let g:clipboard = {
			\ 'name': 'xclip',
			\ 'copy': {
			\ '+': ['xclip', '-selection', 'clipboard', '-i'],
			\ '*': ['xclip', '-selection', 'primary', '-i']
			\ },
			\ 'paste': {
			\ '+': ['xclip', '-selection', 'clipboard', '-o'],
			\ '*': ['xclip', '-selection', 'primary', '-o']
			\ },
			\ 'cache_enabled': 0
			\}

call plug#begin('~/.vim/plugged')
Plug 'pangloss/vim-javascript'
Plug 'neoclide/coc.nvim', {'branch': 'release'}
call plug#end()


inoremap <silent><expr> <TAB> pumvisible() ? "\<C-n>" : "\<TAB>"
inoremap <silent><expr> <S-TAB> pumvisible() ? "\<C-p>" : "\<S-TAB>"
inoremap <silent><expr> <CR> pumvisible() ? coc#_select_confirm() : "\<CR>"
nmap K :call CocActionAsync('doHover')<CR>
