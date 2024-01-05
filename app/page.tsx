'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useCallback, useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Line, createWorker } from 'tesseract.js';

import { Input } from '@/components/ui/input';
import Image from 'next/image';

const frameworks = [
  {
    value: 'khm',
    label: 'Khmer'
  },
  {
    value: 'eng',
    label: 'English'
  },
  {
    value: 'hin',
    label: 'India'
  }
];
export default function Home() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('eng');

  const [selectedImage, setSelectedImage] = useState(null);
const [textResult, setTextResult] = useState<Line[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const worker = createWorker();

  const convertImageToText = useCallback(async () => {
    if (!selectedImage) return;

    setIsLoading(true);

    await worker.load();
    await worker.loadLanguage(value);
    await worker.initialize(value);
    const { data } = await worker.recognize(selectedImage);
    setIsLoading(false);
    setTextResult(data.lines);
  }, [selectedImage, worker]);

  useEffect(() => {
    if (selectedImage) {
      console.log('Select iamge');
      convertImageToText();
    }
  }, [selectedImage]);

  const handleChangeImg = (e: any) => {
    console.log('Handle image triiger');
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null);
      setTextResult([]);
    }
    console.log(selectedImage);
  };

  console.log(value);
  return (
    <div className='section flex flex-col flex-1'>
      <div className='pb-5'>
        <h2>Image to text translator</h2>
        <p className='text-primary/50'>
          Extract your favorite text from image with us
        </p>
      </div>
      <div className='mb-5 items-center flex flex-row justify-between'>
        <Input id='picture' type='file' onChange={handleChangeImg} />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='w-[200px] justify-between'>
              {value
                ? frameworks.find((framework) => framework.value === value)
                    ?.label
                : 'Select Language...'}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandInput placeholder='Search framework...' />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === framework.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row'>
        {selectedImage && (
       
          <Image
            src={URL.createObjectURL(selectedImage)}
            alt={'selectedImage'}
            width={500}
            height={500}
          />
        )}
        <div className='ml-5'>
          {isLoading === true ? (
            <div className='flex flex-col gap-5 items-center justify-center h-[calc(100vh-100px)]'>
              <div className='lds-ring'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className='text-center'>
                <p>Please wait.</p>
                <p>It will just take a moment.</p>
              </div>
            </div>
          ) : (
            textResult && (
              <div>
                {textResult.map((line, index) => {
                  return <p key={index}>{line.text}</p>;
                })}
              </div>
            )
          )}
        </div>
      </div>

      <div className='rounded-lg border bg-card text-card-foreground shadow-sm mt-5'>
        <div className='flex flex-col space-y-1.5 p-6'>
          <h3 className='text-2xl font-semibold leading-none tracking-tight'>
            Team Members
          </h3>
          <p className='text-sm text-muted-foreground'>
            Who collaborate in this project
          </p>
        </div>
        <div className='p-6 pt-0 grid gap-6"'>
          <div className='flex items-center space-x-4 pb-4'>
            <div>
              <p className='text-sm font-medium leading-none'>Seak Kimhour </p>
              <p className='text-sm text-muted-foreground'>
                seakkimhour20@kit.edu.kh
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-4 pb-4'>
            <div>
              <p className='text-sm font-medium leading-none'>Chim Sovann</p>
              <p className='text-sm text-muted-foreground'>
                chimsovann20@kit.edu.kh
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-4 pb-4'>
            <div>
              <p className='text-sm font-medium leading-none'>Srun China</p>
              <p className='text-sm text-muted-foreground'>
                srunchina20@kit.edu.kh
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <div>
              <p className='text-sm font-medium leading-none'>Huot Monirith</p>
              <p className='text-sm text-muted-foreground'>huotmonirith20@kit.edu.kh </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
