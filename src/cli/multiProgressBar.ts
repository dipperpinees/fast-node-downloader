import cliProgress from 'cli-progress';

const multiBar = new cliProgress.MultiBar(
    {
        clearOnComplete: false,
        hideCursor: true,
        format: ' {bar} | {worker} | {value}/{total}',
    },
    cliProgress.Presets.shades_grey
);

export default multiBar;
