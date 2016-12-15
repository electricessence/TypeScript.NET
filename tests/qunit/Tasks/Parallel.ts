import {Parallel} from "../../../dist/amd/System/Threading/Tasks/Parallel";
export default function run()
{
	Parallel.maxConcurrency(3)
		.startNew([1, 2, 3], data =>
		{
			console.log(data);
		})
		.then(() =>
		{
			console.log("parallel check ok");
		});
}