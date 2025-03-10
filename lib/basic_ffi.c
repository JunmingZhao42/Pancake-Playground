#include <stdio.h>
#include <stdint.h>

static char cml_memory[1024*4];
extern void *cml_heap;
extern void *cml_stack;
extern void *cml_stackend;

extern void cml_main(void);

void cml_exit(int arg) {
    printf("ERROR! We should not be getting here\n");
}

void cml_err(int arg) {
    if (arg == 3) {
        printf("Memory not ready for entry. You may have not run the init code yet, or be trying to enter during an FFI call.\n");
    }
    cml_exit(arg);
}

/* Need to come up with a replacement for this clear cache function.
    Might be worth testing just flushing the entire l1 cache,
    but might cause issues with returning to this file
*/
void cml_clear() {
    printf("Trying to clear cache\n");
}

void init_pancake_mem() {
    unsigned long cml_heap_sz = 1024*2;
    unsigned long cml_stack_sz = 1024*2;
    cml_heap = cml_memory;
    cml_stack = cml_heap + cml_heap_sz;
    cml_stackend = cml_stack + cml_stack_sz;
}

int main() {
    init_pancake_mem();
    uintptr_t *pnk_mem = (uintptr_t *) cml_heap;
    cml_main();
    return 0;
}

void ffiprint(unsigned char *c, long clen, unsigned char *a, long alen) {
    printf("Pancake FFI print int:\n");
    printf("%p \n", (void *) c);
    printf("%li \n", clen);
    printf("%p \n", (void *) a);
    printf("%li \n", alen);
}