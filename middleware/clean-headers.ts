export default defineEventHandler((event) => {
    setResponseHeader(event, 'Origin-Trial', '');
})
